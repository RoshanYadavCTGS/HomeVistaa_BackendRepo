"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const response_1 = require("../utils/response");
function validate(schema, part = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[part]);
        if (!result.success) {
            const errors = result.error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            (0, response_1.sendBadRequest)(res, 'Validation failed', errors);
            return;
        }
        // Replace request part with sanitized/coerced data
        req[part] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map