"use client";

import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, Copy, Check, Sparkles } from "lucide-react";

interface TemplateItem {
  id: string;
  name: string;
  ieltsTypes: string;
  tag: string;
  color: string;
  description: string;
  sampleContent: string;
  sampleAnswers: Record<number, string>;
  tips: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "mc",
    name: "Multiple Choice (1 đáp án)",
    ieltsTypes: "Type 1",
    tag: "[MC{n}:A,B,C,D]",
    color: "border-blue-500/30 bg-blue-500/5",
    description: "Thí sinh chọn 1 đáp án đúng từ A, B, C, D. Hiển thị dạng radio button.",
    sampleContent: [
      '<h3>Questions 1-3</h3>',
      '<p><em>Choose the correct letter, <strong>A, B, C</strong> or <strong>D</strong>.</em></p>',
      '',
      '<p><strong>1.</strong> What is the main purpose of the passage?</p>',
      '<p>A &nbsp; To describe the history of solar energy</p>',
      '<p>B &nbsp; To compare different renewable energy sources</p>',
      '<p>C &nbsp; To argue for increased government funding</p>',
      '<p>D &nbsp; To explain how solar panels work</p>',
      '[MC1:A,B,C,D]',
      '',
      '<p><strong>2.</strong> According to the passage, what happened in 2015?</p>',
      '<p>A &nbsp; Solar panel prices dropped significantly</p>',
      '<p>B &nbsp; A new government policy was introduced</p>',
      '<p>C &nbsp; The first solar farm was built</p>',
      '<p>D &nbsp; Research funding was cut</p>',
      '[MC2:A,B,C,D]',
      '',
      '<p><strong>3.</strong> The writer suggests that in the future, solar energy will</p>',
      '<p>A &nbsp; replace all fossil fuels</p>',
      '<p>B &nbsp; become more affordable</p>',
      '<p>C &nbsp; be used only in hot countries</p>',
      '<p>D &nbsp; require less maintenance</p>',
      '[MC3:A,B,C,D]',
    ].join('\n'),
    sampleAnswers: { 1: "B", 2: "A", 3: "B" },
    tips: "Mỗi câu 1 tag [MC{n}:A,B,C,D]. Các lựa chọn viết bằng HTML phía trên tag. Answer key chỉ cần ghi chữ cái (A/B/C/D).",
  },
  {
    id: "mcm",
    name: "Multiple Choice (Nhiều đáp án)",
    ieltsTypes: "Type 2",
    tag: "[MCM{n}:A,B,C,D,E/{k}]",
    color: "border-sky-500/30 bg-sky-500/5",
    description: "Thí sinh chọn nhiều đáp án (ví dụ: chọn 2 trong 5). Hiển thị dạng checkbox.",
    sampleContent: [
      '<h3>Questions 4-5</h3>',
      '<p><em>Choose <strong>TWO</strong> letters, <strong>A-E</strong>.</em></p>',
      '',
      '<p>Which TWO of the following are mentioned as advantages of wind energy?</p>',
      '<p>A &nbsp; It produces no waste</p>',
      '<p>B &nbsp; It is available everywhere</p>',
      '<p>C &nbsp; It creates many jobs</p>',
      '<p>D &nbsp; It requires little maintenance</p>',
      '<p>E &nbsp; It is the cheapest energy source</p>',
      '[MCM4:A,B,C,D,E/2]',
      '[MCM5:A,B,C,D,E/2]',
    ].join('\n'),
    sampleAnswers: { 4: "A,C", 5: "A,C" },
    tips: "Số sau dấu / là số đáp án cần chọn. VD: /2 = chọn 2. Mỗi câu 1 tag. Answer key ghi các chữ cái cách dấu phẩy (A,C).",
  },
  {
    id: "tfng",
    name: "True / False / Not Given",
    ieltsTypes: "Type 3",
    tag: "[TFNG{n}]",
    color: "border-emerald-500/30 bg-emerald-500/5",
    description: "Thí sinh chọn TRUE, FALSE, hoặc NOT GIVEN. Hiển thị 3 nút bấm.",
    sampleContent: [
      '<h3>Questions 6-9</h3>',
      '<p><em>Do the following statements agree with the information given in the passage?</em></p>',
      '<p><em>Write</em></p>',
      '<p><strong>&nbsp;&nbsp;TRUE</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if the statement agrees with the information</p>',
      '<p><strong>&nbsp;&nbsp;FALSE</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if the statement contradicts the information</p>',
      '<p><strong>&nbsp;&nbsp;NOT GIVEN</strong> &nbsp; if there is no information on this</p>',
      '',
      '<p><strong>6.</strong> Solar energy was first used in the 19th century.</p>',
      '[TFNG6]',
      '',
      '<p><strong>7.</strong> The cost of solar panels has decreased by 80% since 2010.</p>',
      '[TFNG7]',
      '',
      '<p><strong>8.</strong> Most governments support solar energy development.</p>',
      '[TFNG8]',
      '',
      '<p><strong>9.</strong> Solar energy can be stored indefinitely.</p>',
      '[TFNG9]',
    ].join('\n'),
    sampleAnswers: { 6: "TRUE", 7: "TRUE", 8: "NOT GIVEN", 9: "FALSE" },
    tips: "Không cần options, chỉ cần [TFNG{n}]. Answer key: TRUE, FALSE, hoặc NOT GIVEN (viết hoa).",
  },
  {
    id: "ynng",
    name: "Yes / No / Not Given",
    ieltsTypes: "Type 4",
    tag: "[YNNG{n}]",
    color: "border-green-500/30 bg-green-500/5",
    description: "Tương tự T/F/NG nhưng dùng cho câu hỏi về quan điểm/ý kiến tác giả.",
    sampleContent: [
      '<h3>Questions 10-13</h3>',
      '<p><em>Do the following statements agree with the views/claims of the writer?</em></p>',
      '<p><em>Write</em></p>',
      '<p><strong>&nbsp;&nbsp;YES</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if the statement agrees with the views of the writer</p>',
      '<p><strong>&nbsp;&nbsp;NO</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if the statement contradicts the views of the writer</p>',
      '<p><strong>&nbsp;&nbsp;NOT GIVEN</strong> &nbsp; if it is impossible to say what the writer thinks about this</p>',
      '',
      '<p><strong>10.</strong> The author believes renewable energy is essential for the future.</p>',
      '[YNNG10]',
      '',
      '<p><strong>11.</strong> The author thinks nuclear energy is too dangerous.</p>',
      '[YNNG11]',
      '',
      '<p><strong>12.</strong> The author supports government subsidies for solar panels.</p>',
      '[YNNG12]',
      '',
      '<p><strong>13.</strong> The author believes fossil fuels will disappear within 20 years.</p>',
      '[YNNG13]',
    ].join('\n'),
    sampleAnswers: { 10: "YES", 11: "NOT GIVEN", 12: "YES", 13: "NO" },
    tips: "Giống T/F/NG nhưng dùng YES/NO thay cho TRUE/FALSE. Answer key: YES, NO, hoặc NOT GIVEN.",
  },
  {
    id: "mh",
    name: "Matching Headings",
    ieltsTypes: "Type 5",
    tag: "[MH{n}:i,ii,iii,...]",
    color: "border-purple-500/30 bg-purple-500/5",
    description: "Thí sinh chọn heading phù hợp cho mỗi đoạn văn từ danh sách (i, ii, iii...). Hiển thị dropdown.",
    sampleContent: [
      '<h3>Questions 14-17</h3>',
      '<p><em>The passage has four paragraphs, <strong>A-D</strong>.</em></p>',
      '<p><em>Choose the correct heading for each paragraph from the list of headings below.</em></p>',
      '',
      '<p><strong>List of Headings</strong></p>',
      '<p>i &nbsp;&nbsp;&nbsp; The environmental impact of fossil fuels</p>',
      '<p>ii &nbsp;&nbsp; Government policies on renewable energy</p>',
      '<p>iii &nbsp; The growth of solar technology</p>',
      '<p>iv &nbsp; Challenges facing wind energy</p>',
      '<p>v &nbsp;&nbsp; Future predictions for energy markets</p>',
      '<p>vi &nbsp; The role of nuclear power</p>',
      '<p>vii &nbsp;Economic benefits of green energy</p>',
      '',
      '<p><strong>14.</strong> Paragraph A</p>',
      '[MH14:i,ii,iii,iv,v,vi,vii]',
      '',
      '<p><strong>15.</strong> Paragraph B</p>',
      '[MH15:i,ii,iii,iv,v,vi,vii]',
      '',
      '<p><strong>16.</strong> Paragraph C</p>',
      '[MH16:i,ii,iii,iv,v,vi,vii]',
      '',
      '<p><strong>17.</strong> Paragraph D</p>',
      '[MH17:i,ii,iii,iv,v,vi,vii]',
    ].join('\n'),
    sampleAnswers: { 14: "iii", 15: "i", 16: "ii", 17: "v" },
    tips: "Options là danh sách heading viết bằng số La Mã. Tất cả câu dùng chung 1 list options. Answer key ghi heading đúng (i, ii, iii...).",
  },
  {
    id: "mi",
    name: "Matching Information",
    ieltsTypes: "Type 6",
    tag: "[MI{n}:A,B,C,D,...]",
    color: "border-violet-500/30 bg-violet-500/5",
    description: "Thí sinh nối thông tin với đoạn văn chứa nó (A, B, C, D...). Hiển thị dropdown.",
    sampleContent: [
      '<h3>Questions 18-21</h3>',
      '<p><em>The passage has five paragraphs, <strong>A-E</strong>.</em></p>',
      '<p><em>Which paragraph contains the following information?</em></p>',
      '',
      '<p><strong>18.</strong> a reference to the cost of energy production</p>',
      '[MI18:A,B,C,D,E]',
      '',
      '<p><strong>19.</strong> an explanation of how solar panels work</p>',
      '[MI19:A,B,C,D,E]',
      '',
      '<p><strong>20.</strong> a comparison between solar and wind energy</p>',
      '[MI20:A,B,C,D,E]',
      '',
      '<p><strong>21.</strong> mention of future energy trends</p>',
      '[MI21:A,B,C,D,E]',
    ].join('\n'),
    sampleAnswers: { 18: "C", 19: "A", 20: "D", 21: "E" },
    tips: "Options là tên các đoạn (A, B, C, D, E...). Có thể dùng lại 1 đoạn cho nhiều câu. Answer key ghi chữ cái đoạn văn.",
  },
  {
    id: "mf",
    name: "Matching Features",
    ieltsTypes: "Type 7",
    tag: "[MF{n}:A,B,C,D]",
    color: "border-indigo-500/30 bg-indigo-500/5",
    description: "Nối thông tin với người/tổ chức/khái niệm được đề cập trong bài. Hiển thị dropdown.",
    sampleContent: [
      '<h3>Questions 22-25</h3>',
      '<p><em>Look at the following statements (Questions 22-25) and the list of researchers below.</em></p>',
      '<p><em>Match each statement with the correct researcher, <strong>A-D</strong>.</em></p>',
      '',
      '<p><strong>List of Researchers</strong></p>',
      '<p>A &nbsp; Dr. Sarah Chen</p>',
      '<p>B &nbsp; Professor James Wilson</p>',
      '<p>C &nbsp; Dr. Maria Santos</p>',
      '<p>D &nbsp; Professor Ahmed Khan</p>',
      '',
      '<p><strong>22.</strong> Solar efficiency can be doubled with new materials.</p>',
      '[MF22:A,B,C,D]',
      '',
      '<p><strong>23.</strong> Wind energy is more reliable than solar in northern regions.</p>',
      '[MF23:A,B,C,D]',
      '',
      '<p><strong>24.</strong> Government funding is crucial for renewable energy research.</p>',
      '[MF24:A,B,C,D]',
      '',
      '<p><strong>25.</strong> Battery technology is the key to renewable energy storage.</p>',
      '[MF25:A,B,C,D]',
    ].join('\n'),
    sampleAnswers: { 22: "A", 23: "B", 24: "D", 25: "C" },
    tips: "Options là tên/ký hiệu của các features (người, tổ chức...). Answer key ghi chữ cái tương ứng.",
  },
  {
    id: "mse",
    name: "Matching Sentence Endings",
    ieltsTypes: "Type 8",
    tag: "[MSE{n}:A,B,C,D,E,F]",
    color: "border-fuchsia-500/30 bg-fuchsia-500/5",
    description: "Nối nửa đầu câu với nửa sau phù hợp. Hiển thị dropdown.",
    sampleContent: [
      '<h3>Questions 26-28</h3>',
      '<p><em>Complete each sentence with the correct ending, <strong>A-F</strong>, below.</em></p>',
      '',
      '<p><strong>A</strong> &nbsp; has increased dramatically since 2010.</p>',
      '<p><strong>B</strong> &nbsp; remains the cheapest source of electricity.</p>',
      '<p><strong>C</strong> &nbsp; requires significant government investment.</p>',
      '<p><strong>D</strong> &nbsp; is expected to replace fossil fuels by 2050.</p>',
      '<p><strong>E</strong> &nbsp; has been criticised for its environmental impact.</p>',
      '<p><strong>F</strong> &nbsp; depends on geographical conditions.</p>',
      '',
      '<p><strong>26.</strong> The use of solar panels in residential areas...</p>',
      '[MSE26:A,B,C,D,E,F]',
      '',
      '<p><strong>27.</strong> Nuclear energy, despite its efficiency,...</p>',
      '[MSE27:A,B,C,D,E,F]',
      '',
      '<p><strong>28.</strong> The effectiveness of wind energy...</p>',
      '[MSE28:A,B,C,D,E,F]',
    ].join('\n'),
    sampleAnswers: { 26: "A", 27: "E", 28: "F" },
    tips: "Options là danh sách ending (A-F). Số endings thường nhiều hơn số câu hỏi. Answer key ghi chữ cái ending đúng.",
  },
  {
    id: "fill",
    name: "Sentence / Note / Table / Diagram Completion",
    ieltsTypes: "Types 9, 11, 12, 13, 14",
    tag: "[Q{n}]",
    color: "border-slate-500/30 bg-slate-500/5",
    description: "Thí sinh điền từ/cụm từ vào chỗ trống. Dùng cho: Sentence Completion, Summary (no word list), Note/Table/Flow-chart, Diagram Label, Short Answer.",
    sampleContent: [
      '<h3>Questions 29-33</h3>',
      '<p><em>Complete the sentences below.</em></p>',
      '<p><em>Choose <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> from the passage for each answer.</em></p>',
      '',
      '<p><strong>29.</strong> Solar panels were first developed in the year [Q29].</p>',
      '',
      '<p><strong>30.</strong> The efficiency of modern solar panels is approximately [Q30] percent.</p>',
      '',
      '<p><strong>31.</strong> The largest solar farm in the world is located in [Q31].</p>',
      '',
      '<h3>Questions 32-33</h3>',
      '<p><em>Complete the table below.</em></p>',
      '',
      '<table>',
      '<tr><th>Energy Source</th><th>Main Advantage</th><th>Main Disadvantage</th></tr>',
      '<tr><td>Solar</td><td>[Q32]</td><td>Depends on weather</td></tr>',
      '<tr><td>Wind</td><td>Low operating cost</td><td>[Q33]</td></tr>',
      '</table>',
    ].join('\n'),
    sampleAnswers: { 29: "1954", 30: "22", 31: "China", 32: "no emissions", 33: "noise pollution" },
    tips: "Tag đơn giản nhất: [Q{n}]. Dùng cho mọi dạng điền từ. Answer key ghi đáp án chính xác (chữ/số). Có thể đặt tag trong <table> cho dạng Table Completion.",
  },
  {
    id: "sc",
    name: "Summary Completion (Word List)",
    ieltsTypes: "Type 10",
    tag: "[SC{n}:word1,word2,...]",
    color: "border-amber-500/30 bg-amber-500/5",
    description: "Thí sinh chọn từ từ word bank cho sẵn để điền vào summary. Hiển thị dropdown với danh sách từ.",
    sampleContent: [
      '<h3>Questions 34-37</h3>',
      '<p><em>Complete the summary below.</em></p>',
      '<p><em>Choose <strong>ONE WORD ONLY</strong> from the box below for each answer.</em></p>',
      '',
      '<table>',
      '<tr>',
      '<td><strong>efficient &nbsp;&nbsp; expensive &nbsp;&nbsp; renewable &nbsp;&nbsp; fossil &nbsp;&nbsp; storage &nbsp;&nbsp; government &nbsp;&nbsp; nuclear &nbsp;&nbsp; pollution</strong></td>',
      '</tr>',
      '</table>',
      '',
      '<p>Solar energy is a [SC34:efficient,expensive,renewable,fossil,storage,government,nuclear,pollution] source of power. However, the main challenge is energy [SC35:efficient,expensive,renewable,fossil,storage,government,nuclear,pollution]. Unlike [SC36:efficient,expensive,renewable,fossil,storage,government,nuclear,pollution] fuels, solar energy produces no [SC37:efficient,expensive,renewable,fossil,storage,government,nuclear,pollution].</p>',
    ].join('\n'),
    sampleAnswers: { 34: "renewable", 35: "storage", 36: "fossil", 37: "pollution" },
    tips: "Mỗi tag chứa cùng 1 word list. Thí sinh chọn từ dropdown. Answer key ghi từ đúng. Word list nên có nhiều từ hơn số câu hỏi (từ dư).",
  },
];

interface QuestionGuideProps {
  onInsertTemplate?: (content: string, answers: Record<number, string>) => void;
}

export default function QuestionGuide({ onInsertTemplate }: QuestionGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="border border-primary/20 rounded-2xl overflow-hidden mb-6">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-primary/10 px-5 py-4 flex items-center justify-between hover:bg-primary/15 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Info size={14} className="text-primary" />
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            Hướng dẫn tạo đề — 14 dạng câu hỏi IELTS Reading
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-primary" />
        ) : (
          <ChevronDown size={16} className="text-primary" />
        )}
      </button>

      {/* Quick summary */}
      <div className="bg-primary/5 px-5 py-3 border-t border-primary/10">
        <p className="text-[10px] text-slate-400 leading-relaxed font-body">
          <strong className="text-slate-300">Quy trình:</strong>{" "}
          1. Paste bài đọc vào &quot;Reading Passage&quot; →{" "}
          2. Paste/soạn câu hỏi + chèn tag vào &quot;Interactive Content&quot; →{" "}
          3. Nhập đáp án vào &quot;Answer Keys&quot;
        </p>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="border-t border-white/5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Quick tag reference */}
          <div className="px-5 py-4 bg-slate-950/50 border-b border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">
              Tất cả Tags — Copy nhanh
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {[
                { tag: "[Q1]", label: "Fill Blank", color: "text-slate-300" },
                { tag: "[MC1:A,B,C,D]", label: "MC (1 ans)", color: "text-blue-400" },
                { tag: "[MCM1:A,B,C,D,E/2]", label: "MC (multi)", color: "text-sky-400" },
                { tag: "[TFNG1]", label: "T/F/NG", color: "text-emerald-400" },
                { tag: "[YNNG1]", label: "Y/N/NG", color: "text-green-400" },
                { tag: "[MH1:i,ii,iii,iv]", label: "Match Heading", color: "text-purple-400" },
                { tag: "[MI1:A,B,C,D,E]", label: "Match Info", color: "text-violet-400" },
                { tag: "[MF1:A,B,C,D]", label: "Match Feature", color: "text-indigo-400" },
                { tag: "[MSE1:A,B,C,D,E,F]", label: "Match Ending", color: "text-fuchsia-400" },
                { tag: "[SC1:w1,w2,w3]", label: "Word List", color: "text-amber-400" },
              ].map((item) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => handleCopy(item.tag, item.tag)}
                  className="group flex flex-col gap-1 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all text-left"
                >
                  <code className={`text-[10px] font-mono font-bold ${item.color}`}>
                    {item.tag}
                  </code>
                  <span className="text-[8px] text-slate-600 group-hover:text-slate-400">
                    {item.label}
                  </span>
                  {copiedId === item.tag && (
                    <span className="text-[8px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check size={8} /> Copied!
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Template cards */}
          <div className="p-5 space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles size={11} /> Mẫu chi tiết từng dạng — Click để xem + Copy
            </p>

            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className={`border rounded-2xl overflow-hidden transition-all ${tmpl.color}`}
              >
                {/* Template header */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedTemplate(
                      expandedTemplate === tmpl.id ? null : tmpl.id
                    )
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[8px] font-black text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                      {tmpl.ieltsTypes}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {tmpl.name}
                    </span>
                    <code className="text-[9px] font-mono text-slate-500 hidden lg:inline">
                      {tmpl.tag}
                    </code>
                  </div>
                  {expandedTemplate === tmpl.id ? (
                    <ChevronUp size={14} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-500" />
                  )}
                </button>

                {/* Template body */}
                {expandedTemplate === tmpl.id && (
                  <div className="border-t border-white/5">
                    {/* Description */}
                    <div className="px-4 py-3 bg-white/[0.01]">
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    {/* Sample content */}
                    <div className="px-4 py-3 border-t border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          Mẫu Interactive Content
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                tmpl.sampleContent,
                                `content-${tmpl.id}`
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-bold text-slate-400 hover:text-white transition-all"
                          >
                            {copiedId === `content-${tmpl.id}` ? (
                              <>
                                <Check size={10} className="text-emerald-400" />{" "}
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={10} /> Copy Content
                              </>
                            )}
                          </button>
                          {onInsertTemplate && (
                            <button
                              type="button"
                              onClick={() =>
                                onInsertTemplate(
                                  tmpl.sampleContent,
                                  tmpl.sampleAnswers
                                )
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-[9px] font-bold text-primary transition-all"
                            >
                              <Sparkles size={10} /> Insert Template
                            </button>
                          )}
                        </div>
                      </div>
                      <pre className="bg-slate-950 rounded-xl p-4 text-[10px] text-slate-400 font-mono leading-relaxed overflow-x-auto max-h-72 custom-scrollbar whitespace-pre-wrap break-words">
                        {tmpl.sampleContent}
                      </pre>
                    </div>

                    {/* Sample answers */}
                    <div className="px-4 py-3 border-t border-white/5">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        Answer Keys mẫu
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(tmpl.sampleAnswers).map(
                          ([qNum, ans]) => (
                            <div
                              key={qNum}
                              className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5"
                            >
                              <span className="text-[9px] font-black text-emerald-400">
                                Q{qNum}
                              </span>
                              <span className="text-[9px] text-white font-bold">
                                {String(ans)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="px-4 py-3 border-t border-white/5 bg-amber-500/5">
                      <p className="text-[9px] text-amber-400 leading-relaxed flex gap-2">
                        <span className="shrink-0">💡</span>
                        <span>{tmpl.tips}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
