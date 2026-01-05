"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async find(options) {
        const mergedWhere = this.mergeWithActive(options?.where);
        return this.repository.find({ ...options, where: mergedWhere });
    }
    async findOne(options, q) {
        const mergedWhere = this.mergeWithActive(options?.where);
        const findOptions = { ...options, where: mergedWhere };
        if (q) {
            return q.manager.findOne(this.repository.target, findOptions);
        }
        return this.repository.findOne(findOptions);
    }
    async findAll(options) {
        const mergedWhere = this.mergeWithActive(options?.where);
        return this.repository.find({ ...options, where: mergedWhere });
    }
    async findOneBy(conditions) {
        const where = { ...conditions, active: true };
        return this.repository.findOneBy(where);
    }
    async findOneById(id) {
        return this.findOneBy({ id });
    }
    createInstance(data, q) {
        if (q) {
            return q.manager.create(this.repository.target, data);
        }
        return this.repository.create(data);
    }
    async saveInstance(entity, q) {
        if (q) {
            return q.manager.save(this.repository.target, entity);
        }
        return await this.repository.save(entity);
    }
    mergeWithActive(where) {
        if (!where) {
            return { active: true };
        }
        if (Array.isArray(where)) {
            return where.map(w => ({ ...w, active: true }));
        }
        return { ...where, active: true };
    }
    getRepository() {
        return this.repository;
    }
    createQueryBuilder(alias) {
        return this.repository
            .createQueryBuilder(alias)
            .where(`${alias}.active = :active`, { active: true });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map