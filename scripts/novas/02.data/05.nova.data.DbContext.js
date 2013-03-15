/// <reference path="01.ArrayExtensions.js" />
/// <reference path="02.nova.data.Entity.js" />
/// <reference path="03.nova.data.Queryable.js" />
/// <reference path="04.nova.data.Repository.js" />


if (window.nova == undefined) {
    window.nova = {};
}
if (nova.data == undefined) {
    nova.data = {};
}

nova.data.DbContext = function (name, version, displayName, estimatedSize) {
    this.db = null;
    this.version = version;
    this.versions = new nova.data.Repository(this, nova.data.DbVersion, "versions");
    if(name !=undefined) {
        if (window.openDatabase) {
            this.db = window.openDatabase(name, "1.0", displayName, estimatedSize);
        }
    }
};

nova.data.DbContext.prototype.initData = function (callback) {
    if (callback != undefined && callback != null) {
        callback();
    }
};

nova.data.DbContext.prototype.init = function (callback) {
    var obj = this;
    obj.isTableExisting("versions", function (exists) {
        function initVersionAndData() {
            var version = new nova.data.DbVersion();
            version.version = obj.version;
            obj.versions.add(version);
            obj.saveChanges(function () {
                obj.initData(callback);
            }, null);
        }
        if (exists) {
            obj.versions.toArray(function (entities) {
                if (entities.length == 0) {
                    initVersionAndData();
                } else {
                    var lastVersion = entities[0];
                    if (lastVersion.version != obj.version) {
                        obj.reCreateTables(function () {
                            initVersionAndData();
                        }, null);
                    }
                    else {
                        if (callback != undefined) {
                            callback();
                        }
                    }
                }
            });
        } else {
            obj.reCreateTables(function () {
                initVersionAndData();
            }, null);
        }
    });
};

nova.data.DbContext.prototype.getTables = function () {
    var tables = [];
    for (property in this) {
        var query = this[property];
        if (query instanceof nova.data.Repository) {
            tables.push(this[property].table);
        }
    }
    return tables;
};

nova.data.DbContext.prototype.isTableExisting = function(table, callback) {
    var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='" + table + "'";
    this.query(sql, function(items) {
        callback(items.length > 0);
    }, function(err) {
        return false;
    });
};

nova.data.DbContext.prototype.reCreateTables = function (successCallback, errorCallback) {
    var obj = this;
    var sqls = [];
    obj.getTables().each(function () {
        var table = this;
        sqls.push("DROP TABLE IF EXISTS " + table);
        var columns = [];
        obj[table].getFields().each(function () {
            if (this.name == "id") {
                columns.push("id INTEGER PRIMARY KEY AUTOINCREMENT");
            } else {
                columns.push(this.name + " " + nova.data.Entity.getDbType(this.type));
            }
        });
        sqls.push("CREATE TABLE " + table + " (" + columns.join() + ")");
    });
    this.executeSql(sqls, successCallback, errorCallback);
};

nova.data.DbContext.prototype.saveChanges = function (successCallback, errorCallback) {
    var sqlDelegates = [];
    var tables = this.getTables();
    for (var ti = 0; ti < tables.length; ti++) {
        var table = tables[ti];
        var query = this[table];
        if (query instanceof nova.data.Repository) {
            var fields = query.getFields();
            query.pendingDeleteEntities.each(function () {
                var removeWhere = this;
                if (this instanceof query.type) {
                    removeWhere = " where id=" + this.id;
                }
                var deleteSql = "delete from " + table + removeWhere;
                sqlDelegates.push({
                    sql: deleteSql
                });
            });

            query.pendingDeleteEntities = [];
            if (query.pendingAddEntities.any()) {
                var columns = fields.select(function () {
                    return this.name;
                }).join();

                query.pendingAddEntities.each(function () {
                    var toAdd = this;
                    var values = [];
                    fields.each(function () {
                        if (this.name == "id") {
                            values.push("null");
                        } else {
                            values.push(nova.data.Entity.getDbValue(this.type, toAdd[this.name]));
                        }
                    });

                    var sqlInsert = "insert into " + table + " (" + columns + ") values (" + values.join() + ")";
                    sqlDelegates.push({
                        sql: sqlInsert,
                        entity: toAdd
                    });
                });
                query.pendingAddEntities = [];
            }

            query.pendingUpdateEntities.each(function () {
                var toUpdate = this;
                var sets = fields.where(function () {
                    return this.name != "id";
                }).select(function () {
                    return this.name + "=" + nova.data.Entity.getDbValue(this.type, toUpdate[this.name]);
                }).join();
                var sqlUpdate = "update " + table + " set " + sets + " where id = " + toUpdate.id;
                sqlDelegates.push({
                    sql: sqlUpdate
                });
            });
            query.pendingUpdateEntities = [];
        }
    }
    if (this.db != null) {
        this.db.transaction(function (dbContext) {
            for (var s = 0; s < sqlDelegates.length; s++) {
                var sqlDelegate = sqlDelegates[s];
                dbContext.executeSql(sqlDelegate.sql, [], function (tx, result) {
                    if (sqlDelegate.entity) {
                        sqlDelegate.entity.id = result.insertId;
                    }
                });
            }
        }, function (err) {
            if (errorCallback == undefined || errorCallback == null) {
                throw err;
            }
            errorCallback(err);
        }, successCallback);
    }
};

nova.data.DbContext.prototype.executeSql = function (sqls, successCallback, errorCallback) {
    if (this.db != null) {
        this.db.transaction(function (dbContext) {
            if (sqls instanceof Array) {
                for (var s = 0; s < sqls.length; s++) {
                    dbContext.executeSql(sqls[s]);
                }
            } else {
                dbContext.executeSql(sqls);
            }
        }, function (err) {
            if (errorCallback == undefined || errorCallback == null) {
                throw err;
            }
        }, function () {
            if (successCallback != undefined) {
                successCallback();
            }
        });
    }
};

nova.data.DbContext.prototype.query = function (sql, successCallback, errorCallback) {
    var obj = this;
    if (obj.db != null) {
        obj.db.transaction(function (dbctx) {
            dbctx.executeSql(sql, [], function (tx, result) {
                var items = [];
                for (var i = 0; i < result.rows.length; i++) {
                    items.push(result.rows.item(i));
                }
                successCallback(items);
            }, function (err) {
                if (errorCallback == undefined || errorCallback == null) {
                    throw err;
                }
                else {
                    errorCallback(err);
                }
            });
        }, function (err) {
            if (errorCallback == undefined || errorCallback == null) {
                throw err;
            }
            else {
                errorCallback(err);
            }
        });
    }
};

nova.data.DbVersion = function() {
    nova.data.Entity.call(this);
    this.version = "";
};
nova.data.DbVersion.prototype = new nova.data.Entity();
nova.data.DbVersion.constructor = nova.data.DbVersion;
