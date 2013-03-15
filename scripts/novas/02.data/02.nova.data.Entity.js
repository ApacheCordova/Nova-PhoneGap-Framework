if (window.nova == undefined) {
    window.nova = {};
}
if (nova.data == undefined) {
    nova.data = {};
}

nova.data.Entity = function () {
    this.id = 0;
};

nova.data.Entity.dataTypes = {
    integer: "integer",
    decimal: "decimal",
    string: "string",
    bool: "boolean",
    object: "object",
    date: "date"
};

nova.data.Entity.prototype.getFields = function () {
    var fields = [];
    var instance = this;
    for (property in instance) {
        var type = typeof (instance[property]);
        var field = {
            name: property
        };
        switch (type) {
            case "number":
                if (instance[field] % 1 != 0) {
                    field.type = nova.data.Entity.dataTypes.decimal;
                }
                else {
                    field.type = nova.data.Entity.dataTypes.integer;
                }
                break;
            case "string":
                field.type = nova.data.Entity.dataTypes.string;
                break;
            case "boolean":
                field.type = nova.data.Entity.dataTypes.bool;
                break;
            case "object":
                var value = instance[field.name];
                if (value instanceof Date) {
                    field.type = nova.data.Entity.dataTypes.date;
                }
                break;
            default:
                break;
        }
        if (field.type != undefined) {
            fields.push(field);
        }
    }
    return fields;
};

nova.data.Entity.getDbType = function (type) {
    switch (type) {
        case nova.data.Entity.dataTypes.integer:
        case nova.data.Entity.dataTypes.bool:
        case nova.data.Entity.dataTypes.date:
            return "INTEGER";
        case nova.data.Entity.dataTypes.decimal:
            return "NUMERIC";
        case nova.data.Entity.dataTypes.string:
            return "TEXT";
        default:
            break;
    }
    return "NULL";
};

nova.data.Entity.parseFromDbValue = function (type, value) {
    if (value == null) {
        return null;
    }
    switch (type) {
        case nova.data.Entity.dataTypes.integer:
        case nova.data.Entity.dataTypes.decimal:
        case nova.data.Entity.dataTypes.string:
            return value;
        case nova.data.Entity.dataTypes.bool:
            return value == 1 ? true : false;
        case nova.data.Entity.dataTypes.date:
            return new Date(value);
        default:
            break;
    }
    return value.toString();
};

nova.data.Entity.getDbValue = function (type, value) {
    if (value == null) {
        return "null";
    }
    switch (type) {
        case nova.data.Entity.dataTypes.integer:
        case nova.data.Entity.dataTypes.decimal:
            return value;
        case nova.data.Entity.dataTypes.string:
            return "'" + value + "'";
        case nova.data.Entity.dataTypes.bool:
            return value ? 1 : 0;
        case nova.data.Entity.dataTypes.date:
            return value.getTime();
        default:
            break;
    }
    return value.toString();
};