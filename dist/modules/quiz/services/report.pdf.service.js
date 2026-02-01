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
exports.ReportPdfService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const stream_1 = require("stream");
const sgMail = require("@sendgrid/mail");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("../../../logger/logger.service");
let ReportPdfService = class ReportPdfService {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.strength_text = {
            visual: {
                poor: 'You tend to observe visuals at a surface level, focusing more on obvious elements than structural relationships. Complex imagery may feel fragmented or unclear. Strategic meaning is often inferred indirectly rather than visually. Strengthening visual decomposition skills can improve clarity.',
                medium: 'You can recognize key visual elements and basic spatial relationships. Your interpretations are generally accurate but rely on familiar patterns. Strategic abstraction is present but limited. With practice, visual insights can become more layered and deliberate.',
                good: 'You demonstrate a solid ability to decode visual information and organize it into coherent mental structures. Your responses show spatial awareness and logical framing. You often extract intent and direction from imagery. This reflects confident visual–strategic processing.',
                excellent: 'You rapidly convert abstract imagery into structured mental models with precision. Visual cues are interpreted holistically and strategically. Your thinking reflects clarity, foresight, and compositional awareness. This is a dominant cognitive strength.',
            },
            auditory: {
                poor: 'Auditory or implied sound elements rarely influence your interpretation. Visuals are processed with minimal narrative or tonal association. Temporal flow may be overlooked. Strengthening verbal or rhythmic imagination can enhance this dimension.',
                medium: 'You occasionally infer tone, rhythm, or implied sound from visuals. Auditory cues are present but secondary to visual reasoning. Interpretations may lack narrative continuity. With attention, this channel can become more expressive.',
                good: 'You show sensitivity to implied sound, tone, and sequencing within visuals. Movement and rhythm are translated into narrative flow. This adds depth to interpretation. Auditory imagination supports strategic understanding.',
                excellent: 'You instinctively layer sound, rhythm, and tone onto visual stimuli. Visuals are experienced as dynamic sequences rather than static images. This enhances storytelling and anticipation. Auditory processing is highly integrated.',
            },
            rhythmic: {
                poor: 'Patterns and repetitions are not immediately recognized. Visuals are interpreted in isolation rather than as sequences. Predictive thinking may be limited. Developing awareness of cycles can improve strategic insight.',
                medium: 'You can identify simple patterns and repetitions when they are explicit. Some sense of progression exists, though it may not drive interpretation. Rhythmic logic is present but underutilized. Predictive clarity can grow with focus.',
                good: 'You naturally identify recurring structures, cycles, and progressions. Visuals are interpreted as part of a broader system. This supports forecasting and logical continuity. Pattern-based reasoning is a noticeable strength.',
                excellent: 'You immediately perceive rhythm, cycles, and underlying systems within imagery. Patterns guide your interpretation and decision-making. This reflects advanced systems thinking. Predictive reasoning is highly developed.',
            },
            subconscious: {
                poor: 'Interpretations tend to remain literal and concrete. Abstract or symbolic elements are often minimized. Intuitive responses are limited. Encouraging open-ended reflection can deepen insight.',
                medium: 'You occasionally engage with symbolic or abstract meanings. Intuition surfaces when prompted but is not dominant. Interpretations balance logic and imagination. There is potential for deeper subconscious engagement.',
                good: 'You comfortably explore ambiguity and implied meaning. Intuitive insights emerge alongside logical reasoning. This adds emotional and conceptual depth. Subconscious interpretation meaningfully influences your responses.',
                excellent: 'You instinctively access abstract, symbolic, and subconscious layers of meaning. Visuals trigger intuitive understanding beyond explicit content. Interpretations are rich, nuanced, and multidimensional.',
            },
        };
        const apiKey = this.configService.get('SENDGRID_API_KEY');
        sgMail.setApiKey(apiKey);
    }
    getLevel(score) {
        if (score <= 25)
            return 'poor';
        if (score <= 50)
            return 'medium';
        if (score <= 75)
            return 'good';
        return 'excellent';
    }
    async generateAttachments(attachmentsInput) {
        const attachments = [];
        for (const item of attachmentsInput) {
            if (item?.buffer instanceof Buffer) {
                attachments.push({
                    content: item.buffer.toString('base64'),
                    filename: item.filename || 'attachment.pdf',
                    type: item.mimeType || 'application/pdf',
                    disposition: 'attachment',
                });
                continue;
            }
            if (typeof item === 'string') {
                const response = await axios_1.default.get(item, {
                    responseType: 'arraybuffer',
                });
                const filename = item.split('/').pop() || 'attachment';
                const mimeType = response.headers['content-type'] ||
                    'application/octet-stream';
                attachments.push({
                    content: Buffer.from(response.data).toString('base64'),
                    filename,
                    type: mimeType,
                    disposition: 'attachment',
                });
            }
        }
        return attachments;
    }
    async sendMail(data) {
        try {
            const msg = {
                to: data?.to,
                from: data.from,
                cc: data.cc,
                subject: data.mailSubject,
                ...(data.text ? { text: data.text } : {}),
                ...(data?.htmlContent ? { html: data.htmlContent } : {}),
            };
            if (data.attachments?.length) {
                msg.attachments = await this.generateAttachments(data.attachments);
            }
            sgMail
                .send(msg)
                .then((response) => {
                this.logger.info(`Email sent successfully to ${data.to}`, data.from, { response });
            })
                .catch(async (error) => {
                this.logger.error(`Email sending failed to ${data.to}`, data.from, { error });
            });
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    sectionTitle(doc, title) {
        doc.moveDown(1.2).fontSize(14).text(title).moveDown(0.5).fontSize(11);
    }
    kv(doc, key, value) {
        doc.text(`${key}: `, { continued: true })
            .font('Helvetica-Bold')
            .text(value);
        doc.font('Helvetica').moveDown(0.3);
    }
    subSection(doc, title, strength) {
        doc.moveDown(1).fontSize(12).text(title);
        doc.fontSize(11).text(`Strength:\n${strength}`);
    }
    async generatePdf(data) {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
        });
        const stream = new stream_1.PassThrough();
        const buffers = [];
        doc.pipe(stream);
        stream.on('data', buffers.push.bind(buffers));
        doc.fontSize(18)
            .text('Neuroprofiling Visual Assessment – Individual Report', {
            align: 'center',
        })
            .moveDown(1.5);
        this.sectionTitle(doc, 'Participant Information');
        this.kv(doc, 'Participant Name', data.name);
        this.kv(doc, 'Email', data.email);
        this.kv(doc, 'Role', data.role);
        this.kv(doc, 'Age Range', data.age_range);
        this.kv(doc, 'Assessment Type', 'Image-Based Strategic Interpretation');
        this.kv(doc, 'Test Duration', `${data.test_duration} minutes`);
        this.kv(doc, 'Date of Assessment', data.report_date);
        this.sectionTitle(doc, 'Assessment Summary');
        doc.fontSize(11).text(`This report is generated based on your responses to a series of visual images presented during the Neuroprofiling Visual Assessment.
For each image, you were asked to explain what you observed strategically. Your responses were analyzed by AI to understand how your mind processes information across different cognitive dimensions.

There are no right or wrong answers. This assessment highlights your natural thinking and interpretation style.`, { align: 'justify' });
        this.sectionTitle(doc, 'Dominant Cognitive Profile');
        this.kv(doc, 'Primary Cognitive Style', data.top_profile);
        this.kv(doc, 'Confidence Level', data.confidence);
        doc.moveDown().text(`This result indicates that your responses consistently aligned with ${data.top_profile}-driven thinking patterns throughout the assessment.`);
        this.sectionTitle(doc, 'Most Suitable Corporate Department');
        this.kv(doc, 'Primary Department', data.recommended_department);
        if (data.secondary_department) {
            this.kv(doc, 'Secondary Department', data.secondary_department);
        }
        doc.moveDown(0.5)
            .fontSize(11)
            .text(data.department_reasoning, { align: 'justify' });
        this.sectionTitle(doc, 'Cognitive Profile Breakdown');
        this.kv(doc, 'Visual Processing', `${data.mix_visual}%`);
        this.kv(doc, 'Rhythmic / Pattern Recognition', `${data.mix_rhythmic}%`);
        this.kv(doc, 'Subconscious / Abstract Insight', `${data.mix_subconscious}%`);
        this.sectionTitle(doc, 'Detailed Cognitive Insights');
        this.subSection(doc, 'Visual Processing', this.strength_text.visual[this.getLevel(data.mix_visual)]);
        this.subSection(doc, 'Rhythmic & Pattern Recognition', this.strength_text.rhythmic[this.getLevel(data.mix_rhythmic)]);
        this.subSection(doc, 'Subconscious & Abstract Interpretation', this.strength_text.subconscious[this.getLevel(data.mix_subconscious)]);
        this.sectionTitle(doc, 'Important Advisory');
        this.sectionTitle(doc, 'Recommended HR Interview Questions');
        doc.fontSize(11).text(`Based on your cognitive profile and dominant thinking style, the following HR interview questions are commonly asked for roles aligned with your recommended department.`, { align: 'justify' });
        doc.moveDown(0.8);
        data.hr_questions?.forEach((question, index) => {
            doc.fontSize(11)
                .text(`${index + 1}. ${question}`, {
                align: 'left',
            })
                .moveDown(0.4);
        });
        doc.fontSize(10).text(`This neuroprofiling report is generated using AI-assisted analysis of visual interpretation patterns.
It is intended solely as a research and self-awareness tool for educational, creative, and cognitive exploration.
This report does not constitute a medical, psychological, or clinical diagnosis and should not be used as a substitute for professional evaluation.`, { align: 'justify' });
        doc.end();
        return new Promise(resolve => {
            stream.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }
    async generatePdfAndSendMail(data) {
        const pdfBuffer = await this.generatePdf(data);
        let result = await this.sendMail({
            to: data.email,
            from: 'no-reply@almonds.ai',
            mailSubject: 'Neuroprofiling Visual Assessment – Individual Report',
            htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Neuroprofiling Report</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px; background:linear-gradient(135deg,#1e3c72,#2a5298); color:#ffffff;">
              <h1 style="margin:0; font-size:22px; font-weight:600;">
                Neuroprofiling Visual Assessment
              </h1>
              <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
                Your Individual Cognitive Insight Report
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px; color:#333333;">
              <p style="font-size:15px; line-height:1.6; margin-top:0;">
                Hello <strong>${data.name}</strong>,
              </p>

              <p style="font-size:15px; line-height:1.6;">
                Thank you for completing the <strong>Neuroprofiling Visual Assessment</strong>.
                Based on your responses, we’ve generated a personalized report that highlights how you naturally process information, patterns, and abstract cues.
              </p>

              <p style="font-size:15px; line-height:1.6;">
                Your detailed report is attached to this email as a PDF. It includes:
              </p>

              <ul style="font-size:15px; line-height:1.6; padding-left:20px;">
                <li>Your dominant cognitive style</li>
                <li>A breakdown across visual, auditory, rhythmic, and abstract dimensions</li>
                <li>Strength insights and growth directions</li>
                <li>Personalized recommendations</li>
              </ul>

              <div style="margin:28px 0; padding:20px; background:#f1f5f9; border-radius:8px;">
                <p style="margin:0; font-size:14px; color:#555555;">
                  <strong>Assessment Summary</strong><br />
                  Role: ${data.role}<br />
                  Test Duration: ${data.test_duration} minutes<br />
                  Report Date: ${data.report_date}
                </p>
              </div>

              <p style="font-size:15px; line-height:1.6;">
                This assessment is designed for self-awareness, learning, and cognitive exploration.
                There are no right or wrong outcomes—only insights into how you think and interpret the world.
              </p>

              <p style="font-size:15px; line-height:1.6;">
                If you have any questions or would like to explore your results further, feel free to reach out to us.
              </p>

              <p style="font-size:15px; line-height:1.6; margin-bottom:0;">
                Warm regards,<br />
                <strong>Team MTNP</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background:#fafafa; font-size:12px; color:#777777;">
              <p style="margin:0; line-height:1.5;">
                ⚠️ This report is generated using AI-assisted analysis and is intended for educational and self-awareness purposes only.
                It does not constitute a medical or psychological diagnosis.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
            attachments: [
                {
                    buffer: pdfBuffer,
                    filename: 'neuroprofiling-report.pdf',
                    mimeType: 'application/pdf',
                },
            ],
        });
        console.log(result);
        return result;
    }
};
exports.ReportPdfService = ReportPdfService;
exports.ReportPdfService = ReportPdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_service_1.CustomLoggerService])
], ReportPdfService);
//# sourceMappingURL=report.pdf.service.js.map