"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmittedQuestionSchema = exports.SubmittedQuestion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const quiz_schema_1 = require("./quiz.schema");
const question_schema_1 = require("./question.schema");
const user_schema_1 = require("../../users/schema/user.schema");
const base_schema_1 = require("../../../common/base.schema");
let SubmittedQuestion = class SubmittedQuestion extends base_schema_1.BaseSchema {
};
exports.SubmittedQuestion = SubmittedQuestion;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: quiz_schema_1.Quiz.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SubmittedQuestion.prototype, "quiz", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: question_schema_1.Question.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SubmittedQuestion.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.MongoUser.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SubmittedQuestion.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: question_schema_1.ResponseType,
        required: true,
        default: question_schema_1.ResponseType.MCQ,
    }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "response_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "response_text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "response_audio_url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "response_image_url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: null }),
    __metadata("design:type", Boolean)
], SubmittedQuestion.prototype, "is_correct", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: 0 }),
    __metadata("design:type", Number)
], SubmittedQuestion.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "dimension", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], SubmittedQuestion.prototype, "answered_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Boolean)
], SubmittedQuestion.prototype, "is_evaluated_by_llm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], SubmittedQuestion.prototype, "confidence_score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: mongoose_2.SchemaTypes.Mixed }),
    __metadata("design:type", Object)
], SubmittedQuestion.prototype, "err_while_evaluation_by_llm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], SubmittedQuestion.prototype, "visual", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], SubmittedQuestion.prototype, "auditory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], SubmittedQuestion.prototype, "rhythmic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], SubmittedQuestion.prototype, "subconscious", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "candidates_approach", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "demonstrated_strengths", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "omissions_or_delays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], SubmittedQuestion.prototype, "hr_interpretation", void 0);
exports.SubmittedQuestion = SubmittedQuestion = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'submitted_questions',
    })
], SubmittedQuestion);
exports.SubmittedQuestionSchema = mongoose_1.SchemaFactory.createForClass(SubmittedQuestion);
exports.SubmittedQuestionSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
//# sourceMappingURL=submitted-question.schema.js.map