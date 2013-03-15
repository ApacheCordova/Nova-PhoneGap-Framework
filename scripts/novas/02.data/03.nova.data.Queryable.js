/// <reference path="ArrayExtensions.js" />
/// <reference path="nova.data.Repository.js" />
/// <reference path="nova.data.DbContext.js" />
/// <reference path="nva.data.Entity.js" />

if (window.nova == undefined) {
    window.nova = {};
}
if (nova.data == undefined) {
    nova.data = {};
}

nova.data.Queryable = function(repository, expression) {
    this.repository = repository;
    this.wheres = [];
    if (expression != undefined && expression != null) {
        this.wheres.push(expression);
    }
};

nova.data.Queryable.prototype.where = function (expression) {
    this.wheres.push(expression);
    return this;
};

nova.data.Queryable.prototype.toArray = function (callback) {
    var repo = this.repository;
    var sql = "select * from " + repo.table;
    if (this.wheres.length > 0) {
        sql += " where " + this.wheres[0];
    }
    for (var w = 1; w < this.wheres.length; w++) {
        sql = "select * from (" + sql + ")as t" + w + " where " + this.wheres[w];
    }
    repo.db.query(sql, function (items) {
        var fields = repo.getFields();
        var entities = [];
        items.each(function () {
            var item = this;
            var entity = new repo.type();
            fields.each(function () {
                entity[this.name] = nova.data.Entity.parseFromDbValue(this.type, item[this.name]);
            });
            entities.push(entity);
        });
        callback(entities);
    });
};