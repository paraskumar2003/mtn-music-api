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
exports.QuestionSchema = exports.Question = exports.ResponseType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schema/user.schema");
const quiz_schema_1 = require("./quiz.schema");
var ResponseType;
(function (ResponseType) {
    ResponseType["TEXT"] = "text";
    ResponseType["AUDIO"] = "audio";
    ResponseType["IMAGE"] = "image";
    ResponseType["MCQ"] = "mcq";
})(ResponseType || (exports.ResponseType = ResponseType = {}));
let Question = class Question {
};
exports.Question = Question;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Question.prototype, "dimension", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Question.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ResponseType,
        required: true,
        default: ResponseType.MCQ,
    }),
    __metadata("design:type", String)
], Question.prototype, "question_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Question.prototype, "prompt_html", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Question.prototype, "image_url", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Question.prototype, "audio_url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], Question.prototype, "options", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Question.prototype, "answer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                options: { type: [String], required: true },
                score: { type: Number, required: true },
                dimension: { type: String, required: true },
                note: { type: String, required: false },
            },
        ],
        required: false,
    }),
    __metadata("design:type", Array)
], Question.prototype, "rubric", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Question.prototype, "seq_no", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.MongoUser.name, required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Question.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: quiz_schema_1.Quiz.name, required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Question.prototype, "quiz", void 0);
exports.Question = Question = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'questions' })
], Question);
exports.QuestionSchema = mongoose_1.SchemaFactory.createForClass(Question);
//# sourceMappingURL=question.schema.js.map