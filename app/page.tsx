"use client";

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  CheckCircle2,
  Download,
  FileDown,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  RefreshCcw,
  Upload,
} from "lucide-react";

type LeaveForm = {
  name: string;
  className: string;
  reason: string;
  destination: string;
  startDate: string;
  endDate: string;
  studentPhone: string;
  parentPhone: string;
  relation: string;
  applicationDate: string;
};

type SignatureUploadProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const today = () => {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const initialForm: LeaveForm = {
  name: "",
  className: "",
  reason: "",
  destination: "",
  startDate: "",
  endDate: "",
  studentPhone: "",
  parentPhone: "",
  relation: "母亲",
  applicationDate: today(),
};

const pageNames = ["请假申请书", "家长知情同意书", "安全告知书"];

function splitDate(value: string) {
  if (!value) return { year: "____", month: "__", day: "__", hour: "__" };
  const date = new Date(value);
  return {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    day: String(date.getDate()).padStart(2, "0"),
    hour: String(date.getHours()).padStart(2, "0"),
  };
}

function dateText(value: string) {
  if (!value) return "____年__月__日";
  const [year, month, day] = value.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function Line({ children, wide = false }: { children?: ReactNode; wide?: boolean }) {
  return <span className={`paper-field ${wide ? "paper-field-wide" : ""}`}>{children || "　"}</span>;
}

function Signature({ src, alt }: { src: string; alt: string }) {
  return src ? <img className="signature-image" src={src} alt={alt} /> : <span className="signature-empty">签名位置</span>;
}

function LeaveApplication({ form, studentSignature, exportMode = false }: { form: LeaveForm; studentSignature: string; exportMode?: boolean }) {
  const start = splitDate(form.startDate);
  const end = splitDate(form.endDate);
  return (
    <article className={`doc-page ${exportMode ? "export-page" : ""}`}>
      <div className="attachment-label">附件1</div>
      <h3>请假申请书</h3>
      <p>尊敬的老师：</p>
      <p className="paper-body">
        本人 <Line>{form.name || "学生姓名"}</Line> 是 <Line>{form.className || "班级"}</Line> 学生，因
        <Line wide>{form.reason || "详细描述具体请假原因"}</Line>，现申请请假，请假时间自
        <Line>{start.year}</Line>年<Line>{start.month}</Line>月<Line>{start.day}</Line>日<Line>{start.hour}</Line>时至
        <Line>{end.year}</Line>年<Line>{end.month}</Line>月<Line>{end.day}</Line>日<Line>{end.hour}</Line>时。请假去向
        <Line wide>{form.destination || "目的地"}</Line>。
      </p>
      <p className="paper-body">
        请假期间严格遵守校纪校规，注意人身、财产安全，遵纪守法、规范言行。若请假期间出现行程变更，将及时与辅导员取得联系，完成相关手续办理。请假到期后，将按时返校，第一时间办理销假手续。
      </p>
      <p className="paper-body">恳请老师批准！</p>
      <div className="signature-block">
        <p className="signature-row">申请人签字：<Signature src={studentSignature} alt="学生签名" /></p>
        <p>本人联系电话：<Line>{form.studentPhone || "联系电话"}</Line></p>
        <p>家长联系电话：<Line>{form.parentPhone || "联系电话"}</Line></p>
        <p className="date-line">{dateText(form.applicationDate)}</p>
      </div>
    </article>
  );
}

function ParentConsent({ form, parentSignature, exportMode = false }: { form: LeaveForm; parentSignature: string; exportMode?: boolean }) {
  const start = splitDate(form.startDate);
  const end = splitDate(form.endDate);
  return (
    <article className={`doc-page ${exportMode ? "export-page" : ""}`}>
      <div className="attachment-label">附件2</div>
      <h3>家长知情同意书</h3>
      <p className="paper-body parent-consent-body">
        本人是 <Line>{form.className || "班级"}</Line> 班 <Line>{form.name || "学生姓名"}</Line> 同学的
        <Line>{form.relation}</Line>（父亲/母亲/法律监护人），学生因
        <Line wide>{form.reason || "详细描述具体请假原因"}</Line>于
        <Line>{start.year}</Line>年<Line>{start.month}</Line>月<Line>{start.day}</Line>日 -
        <Line>{end.year}</Line>年<Line>{end.month}</Line>月<Line>{end.day}</Line>日请假离校，学生去向
        <Line wide>{form.destination || "详细填写学生目的地地址"}</Line>。本人已知并同意学生请假离校事宜，在此期间，将切实履行监护人职责，做好学生的安全提示与日常监管，确保学生遵守法律法规，不参与危险活动，按时返校。若请假期间出现行程变更，将及时与辅导员取得联系，配合学校完成相关手续办理。
      </p>
      <div className="signature-block consent-signature">
        <p className="signature-row">家长签字：<Signature src={parentSignature} alt="家长签名" /></p>
        <p className="date-line">{dateText(form.applicationDate)}</p>
      </div>
    </article>
  );
}

function SafetyNotice({ form, studentSignature, parentSignature, exportMode = false }: { form: LeaveForm; studentSignature: string; parentSignature: string; exportMode?: boolean }) {
  return (
    <article className={`doc-page safety-page ${exportMode ? "export-page" : ""}`}>
      <div className="attachment-label">附件3</div>
      <h3>安全告知书</h3>
      <p>{form.name ? `${form.name}同学、家长：` : "同学、家长："}</p>
      <p className="paper-body">为保障学生假期安全，现将注意事项告知如下，请您仔细阅读：</p>
      <h4>一、交通安全</h4>
      <p className="paper-body">自觉遵守交通法律法规，文明通行、不闯红灯。乘车选择正规交通工具，坚决不乘坐黑车、超载、无牌无证车辆。骑行电动车务必佩戴头盔，严禁酒后驾车等。外出须提前告知家长去向、同行人员及返程时间。</p>
      <h4>二、防溺水安全</h4>
      <p className="paper-body">严格远离河道、湖泊、水库、坑塘等各类危险水域，杜绝私自靠近、涉水、野泳等危险行为，坚决防范溺水事故发生。</p>
      <h4>三、居家安全</h4>
      <p className="paper-body">规范使用电、燃气设备，养成人走断电、关火关气的良好习惯，定期排查居家安全隐患。注意饮食卫生，不吃过期变质食品，身体不适及时就医。高温、暴雨等恶劣天气减少外出，做好防暑避险。</p>
      <h4>四、财产与网络安全</h4>
      <p className="paper-body">妥善保管证件、现金、手机等贵重物品，提高反诈意识，警惕电信诈骗、刷单诈骗、兼职陷阱。合理安排上网时间，文明上网、理性发言，不泄露个人隐私，自觉抵制网络谣言、不良信息及各类网络风险。</p>
      <p className="paper-body">请家长履行监护职责，加强安全教育与监管。学校将持续关注学生动态，学生如遇紧急情况请及时联系辅导员老师。</p>
      <p>感谢您的支持！</p>
      <div className="double-signatures">
        <p className="signature-row">学生签字：<Signature src={studentSignature} alt="学生签名" /></p>
        <p className="signature-row">家长签字：<Signature src={parentSignature} alt="家长签名" /></p>
        <p className="date-line">{dateText(form.applicationDate)}</p>
      </div>
    </article>
  );
}

async function cleanSignature(file: File) {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = source;
  });
  const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return source;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
  for (let index = 0; index < pixels.data.length; index += 4) {
    const r = pixels.data[index], g = pixels.data[index + 1], b = pixels.data[index + 2];
    const darkness = 255 - Math.min(r, g, b);
    const alpha = darkness < 18 ? 0 : Math.min(255, Math.round(darkness * 1.75));
    pixels.data[index] = Math.min(r, 80);
    pixels.data[index + 1] = Math.min(g, 80);
    pixels.data[index + 2] = Math.min(b, 80);
    pixels.data[index + 3] = alpha;
    if (alpha > 20) {
      const position = index / 4;
      const x = position % canvas.width;
      const y = Math.floor(position / canvas.width);
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
  context.putImageData(pixels, 0, 0);
  if (minX > maxX || minY > maxY) return source;
  const padding = 10;
  minX = Math.max(0, minX - padding); minY = Math.max(0, minY - padding);
  maxX = Math.min(canvas.width - 1, maxX + padding); maxY = Math.min(canvas.height - 1, maxY + padding);
  const output = document.createElement("canvas");
  output.width = maxX - minX + 1; output.height = maxY - minY + 1;
  output.getContext("2d")?.drawImage(canvas, minX, minY, output.width, output.height, 0, 0, output.width, output.height);
  return output.toDataURL("image/png");
}

function SignatureUpload({ label, value, onChange }: SignatureUploadProps) {
  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) return;
    onChange(await cleanSignature(file));
  };
  return (
    <div className={`signature-upload ${value ? "has-signature" : ""}`}>
      <div className="upload-title"><span>{label}</span>{value && <CheckCircle2 size={17} />}</div>
      {value ? <img src={value} alt={`${label}预览`} /> : <div className="upload-empty"><Upload size={20} /><span>拍照或选择图片</span><small>自动裁剪并去除白底</small></div>}
      <label className="upload-button"><input aria-label={`${label}图片`} type="file" accept="image/*" onChange={onFile} />{value ? "重新上传" : "上传签名"}</label>
    </div>
  );
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function dataUrlBytes(dataUrl: string) {
  const binary = atob(dataUrl.split(",")[1] || "");
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [studentSignature, setStudentSignature] = useState("");
  const [parentSignature, setParentSignature] = useState("");
  const [activePage, setActivePage] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const exportRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: "stage_leave_form",
      title: "填写请假信息",
      description: "把学生和请假信息填入页面。签名图片仍需用户本人在页面上传，填写后不会自动生成文件。",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "学生姓名" },
          className: { type: "string", description: "班级" },
          reason: { type: "string", description: "详细请假原因" },
          destination: { type: "string", description: "请假期间目的地" },
          startDate: { type: "string", description: "开始时间，格式 YYYY-MM-DDTHH:mm" },
          endDate: { type: "string", description: "结束时间，格式 YYYY-MM-DDTHH:mm" },
          studentPhone: { type: "string", description: "学生联系电话" },
          parentPhone: { type: "string", description: "家长联系电话" },
          relation: { type: "string", enum: ["父亲", "母亲", "法律监护人"] },
        },
        required: ["name", "className", "reason", "destination", "startDate", "endDate", "studentPhone", "parentPhone"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        if (!input || typeof input !== "object") throw new Error("请提供完整的请假信息");
        const values = input as Partial<LeaveForm>;
        const required: (keyof LeaveForm)[] = ["name", "className", "reason", "destination", "startDate", "endDate", "studentPhone", "parentPhone"];
        if (required.some((key) => typeof values[key] !== "string" || !values[key]?.trim())) throw new Error("姓名、班级、原因、去向、时间和联系电话均为必填项");
        setForm((current) => ({ ...current, ...values }));
        setGeneratedImages([]);
        setMessage("请检查信息，然后上传学生签名和家长签名。");
        return { status: "staged", next: "upload_student_and_parent_signatures" };
      },
    };
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* unsupported preview environment */ }
    return () => lifecycle.abort();
  }, []);

  const invalidate = () => generatedImages.length && setGeneratedImages([]);
  const update = (key: keyof LeaveForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    invalidate(); setMessage("");
  };
  const updateStudentSignature = (value: string) => { setStudentSignature(value); invalidate(); };
  const updateParentSignature = (value: string) => { setParentSignature(value); invalidate(); };

  const validate = () => {
    const missing = [form.name, form.className, form.reason, form.destination, form.startDate, form.endDate, form.studentPhone, form.parentPhone, studentSignature, parentSignature].some((value) => !value);
    if (missing) { setMessage("请先填写完整信息，并上传学生和家长签名。仍可在右侧查看当前预览。"); return false; }
    if (new Date(form.endDate) <= new Date(form.startDate)) { setMessage("结束时间需要晚于开始时间。"); return false; }
    return true;
  };

  const generatePreview = async () => {
    if (!validate()) return;
    setBusy(true); setMessage("");
    try {
      await document.fonts.ready;
      const images = await Promise.all(exportRefs.current.map((node) => {
        if (!node) throw new Error("预览页面尚未准备完成");
        return toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: "#ffffff" });
      }));
      setGeneratedImages(images); setActivePage(0); setMessage("三页材料已生成，可逐页检查并下载。");
    } catch {
      setMessage("预览生成失败，请刷新页面后重试。");
    } finally { setBusy(false); }
  };

  const downloadPng = () => {
    const source = generatedImages[activePage];
    if (!source) return;
    const anchor = document.createElement("a");
    anchor.href = source; anchor.download = `${activePage + 1}-${pageNames[activePage]}-${form.name || "学生"}.png`; anchor.click();
  };

  const downloadPdf = async () => {
    if (!generatedImages.length) return;
    setBusy(true);
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
    generatedImages.forEach((image, index) => {
      if (index) pdf.addPage("a4", "portrait");
      pdf.addImage(image, "PNG", 0, 0, 210, 297, undefined, "FAST");
    });
    pdf.save(`请假材料-${form.name || "学生"}.pdf`);
    setBusy(false);
  };

  const downloadWord = async () => {
    if (!validate()) return;
    setBusy(true);
    const { AlignmentType, Document, ImageRun, Packer, PageBreak, Paragraph, TextRun } = await import("docx");
    const start = splitDate(form.startDate), end = splitDate(form.endDate);
    const signatureRun = (source: string) => new ImageRun({ type: "png", data: dataUrlBytes(source), transformation: { width: 125, height: 48 } });
    const body = (text: string) => new Paragraph({ spacing: { line: 480, after: 120 }, indent: { firstLine: 560 }, children: [new TextRun(text)] });
    const title = (text: string) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 360 }, children: [new TextRun({ text, bold: true, size: 36, font: "SimHei" })] });
    const doc = new Document({
      styles: { default: { document: { run: { font: "SimSun", size: 28 } } } },
      sections: [{
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } },
        children: [
          new Paragraph("附件1"), title("请假申请书"), new Paragraph("尊敬的老师："),
          body(`本人${form.name}是${form.className}班学生，因${form.reason}，现申请请假，请假时间自${start.year}年${start.month}月${start.day}日${start.hour}时至${end.year}年${end.month}月${end.day}日${end.hour}时。请假去向${form.destination}。`),
          body("请假期间严格遵守校纪校规，注意人身、财产安全，遵纪守法、规范言行。若请假期间出现行程变更，将及时与辅导员取得联系，完成相关手续办理。请假到期后，将按时返校，第一时间办理销假手续。"),
          body("恳请老师批准！"),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun("申请人签字："), signatureRun(studentSignature)] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun(`本人联系电话：${form.studentPhone}`)] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun(`家长联系电话：${form.parentPhone}`)] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun(dateText(form.applicationDate))] }),
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph("附件2"), title("家长知情同意书"),
          body(`本人是${form.className}班${form.name}同学的${form.relation}（父亲/母亲/法律监护人），学生因${form.reason}于${start.year}年${start.month}月${start.day}日-${end.year}年${end.month}月${end.day}日请假离校，学生去向${form.destination}。本人已知并同意学生请假离校事宜，在此期间，将切实履行监护人职责，做好学生的安全提示与日常监管，确保学生遵守法律法规，不参与危险活动，按时返校。若请假期间出现行程变更，将及时与辅导员取得联系，配合学校完成相关手续办理。`),
          new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 1200 }, children: [new TextRun("家长签字："), signatureRun(parentSignature)] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun(dateText(form.applicationDate))] }),
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph("附件3"), title("安全告知书"), new Paragraph(`${form.name}同学、家长：`),
          body("为保障学生假期安全，现将注意事项告知如下，请您仔细阅读："),
          new Paragraph({ children: [new TextRun({ text: "一、交通安全", bold: true })] }), body("自觉遵守交通法律法规，文明通行、不闯红灯。乘车选择正规交通工具，坚决不乘坐黑车、超载、无牌无证车辆。骑行电动车务必佩戴头盔，严禁酒后驾车等。外出须提前告知家长去向、同行人员及返程时间。"),
          new Paragraph({ children: [new TextRun({ text: "二、防溺水安全", bold: true })] }), body("严格远离河道、湖泊、水库、坑塘等各类危险水域，杜绝私自靠近、涉水、野泳等危险行为，坚决防范溺水事故发生。"),
          new Paragraph({ children: [new TextRun({ text: "三、居家安全", bold: true })] }), body("规范使用电、燃气设备，养成人走断电、关火关气的良好习惯，定期排查居家安全隐患。注意饮食卫生，不吃过期变质食品，身体不适及时就医。高温、暴雨等恶劣天气减少外出，做好防暑避险。"),
          new Paragraph({ children: [new TextRun({ text: "四、财产与网络安全", bold: true })] }), body("妥善保管证件、现金、手机等贵重物品，提高反诈意识，警惕电信诈骗、刷单诈骗、兼职陷阱。合理安排上网时间，文明上网、理性发言，不泄露个人隐私，自觉抵制网络谣言、不良信息及各类网络风险。"),
          body("请家长履行监护职责，加强安全教育与监管。学校将持续关注学生动态，学生如遇紧急情况请及时联系辅导员老师。感谢您的支持！"),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun("学生签字："), signatureRun(studentSignature)] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun("家长签字："), signatureRun(parentSignature)] }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun(dateText(form.applicationDate))] }),
        ],
      }],
    });
    saveBlob(await Packer.toBlob(doc), `请假材料-${form.name || "学生"}.docx`);
    setBusy(false);
  };

  const reset = () => {
    setForm({ ...initialForm, applicationDate: today() }); setStudentSignature(""); setParentSignature(""); setGeneratedImages([]); setMessage(""); setActivePage(0);
  };

  const pages = [
    <LeaveApplication key="leave" form={form} studentSignature={studentSignature} />,
    <ParentConsent key="parent" form={form} parentSignature={parentSignature} />,
    <SafetyNotice key="safety" form={form} studentSignature={studentSignature} parentSignature={parentSignature} />,
  ];

  return (
    <main className="app-shell">
      <section className="workspace">
        <aside className="editor-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">填写材料</span><h2>请假信息</h2></div>
            <button className="ghost-button" type="button" onClick={reset}><RefreshCcw size={15} />清空</button>
          </div>

          <div className="form-grid">
            <label><span>学生姓名 *</span><input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="请输入姓名" /></label>
            <label><span>班级 *</span><input value={form.className} onChange={(e) => update("className", e.target.value)} placeholder="例如：软件 2401" /></label>
            <label className="full-field"><span>请假原因 *</span><textarea value={form.reason} onChange={(e) => update("reason", e.target.value)} placeholder="请详细填写具体请假原因" rows={3} /></label>
            <label className="full-field"><span>请假去向 *</span><input value={form.destination} onChange={(e) => update("destination", e.target.value)} placeholder="填写目的地详细地址" /></label>
            <label><span>开始时间 *</span><input type="datetime-local" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} /></label>
            <label><span>结束时间 *</span><input type="datetime-local" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} /></label>
            <label><span>本人联系电话 *</span><input value={form.studentPhone} onChange={(e) => update("studentPhone", e.target.value)} placeholder="请输入手机号" inputMode="tel" /></label>
            <label><span>家长联系电话 *</span><input value={form.parentPhone} onChange={(e) => update("parentPhone", e.target.value)} placeholder="请输入家长手机号" inputMode="tel" /></label>
            <label><span>监护人关系</span><select value={form.relation} onChange={(e) => update("relation", e.target.value)}><option>父亲</option><option>母亲</option><option>法律监护人</option></select></label>
            <label><span>申请日期</span><input type="date" value={form.applicationDate} onChange={(e) => update("applicationDate", e.target.value)} /></label>
          </div>

          <div className="section-heading"><span className="eyebrow">上传签名</span><h2>自动裁剪和去白底</h2></div>
          <div className="signature-grid">
            <SignatureUpload label="学生签名" value={studentSignature} onChange={updateStudentSignature} />
            <SignatureUpload label="家长签名" value={parentSignature} onChange={updateParentSignature} />
          </div>

          {message && <p className={`form-message ${generatedImages.length ? "success" : ""}`} role="status">{message}</p>}
          <button className="primary-action" type="button" onClick={generatePreview} disabled={busy}>
            {busy ? <LoaderCircle className="spin" size={19} /> : <ImageIcon size={19} />}
            {busy ? "正在生成三页预览…" : "生成三页图片预览"}
          </button>
          <p className="privacy-detail">不会上传姓名、手机号或签名。关闭页面后，当前填写内容将被清除。</p>
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div><span className="eyebrow">{generatedImages.length ? "图片预览已生成" : "实时排版预览"}</span><h2>{pageNames[activePage]}</h2></div>
            <span className="page-chip">第 {activePage + 1} 页 / 共 3 页</span>
          </div>
          <div className="page-tabs" role="tablist" aria-label="切换预览页面">
            {pageNames.map((name, index) => <button type="button" role="tab" aria-selected={activePage === index} className={activePage === index ? "active" : ""} onClick={() => setActivePage(index)} key={name}><span>{index + 1}</span>{name}</button>)}
          </div>

          <div className="paper-stage">
            {generatedImages.length ? <img className="generated-preview" src={generatedImages[activePage]} alt={`${pageNames[activePage]}图片预览`} /> : pages[activePage]}
          </div>

          <div className="download-bar">
            <button type="button" className="secondary-action" onClick={downloadPng} disabled={!generatedImages.length || busy}><Download size={17} />下载本页 PNG</button>
            <button type="button" className="secondary-action" onClick={downloadPdf} disabled={!generatedImages.length || busy}><FileDown size={17} />下载三页 PDF</button>
            <button type="button" className="secondary-action" onClick={downloadWord} disabled={busy}><FileText size={17} />下载 Word</button>
          </div>
        </section>
      </section>

      <div className="export-stack" aria-hidden="true">
        <div ref={(node) => { exportRefs.current[0] = node; }}><LeaveApplication form={form} studentSignature={studentSignature} exportMode /></div>
        <div ref={(node) => { exportRefs.current[1] = node; }}><ParentConsent form={form} parentSignature={parentSignature} exportMode /></div>
        <div ref={(node) => { exportRefs.current[2] = node; }}><SafetyNotice form={form} studentSignature={studentSignature} parentSignature={parentSignature} exportMode /></div>
      </div>
    </main>
  );
}
