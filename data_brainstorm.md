## 🧠 Brainstorm: Implementing 4 Sets of Academic Tests

### Context
The user has provided 4 folders (test_01 to test_04) containing PDFs and MP3s for IELTS skills (Listening, Reading, Writing, Speaking). They want to design 4 mock test sets on the website, excluding the Speaking component, and using the provided answer keys.

---

### Option A: Static Data Integration (JSON/TypeScript)
Manually extract the text and question structures from the 12 PDFs (4 tests x 3 skills) and populate a TypeScript object like `ACADEMIC_TESTS`.

✅ **Pros:**
- Best user experience: Interactive inputs, instant feedback, automatic scoring.
- Mobile-friendly: Questions are optimized for screens.
- Professional "Web-App" feel.

❌ **Cons:**
- Very high manual effort: Extracting tabular data, diagrams, and passages from PDFs is time-consuming.
- High risk of typos or formatting errors during transcription.

📊 **Effort:** High

---

### Option B: PDF Viewer Integration (Split Screen)
Implement a UI that displays the PDF on one side (or top) and the answer input fields on the other.

✅ **Pros:**
- Accurate: Users see exactly what the original test paper looks like (including complex formatting/tables).
- Faster Implementation: No need to transcribe thousands of words.
- Handles complex Listening/Reading structures (match headings, diagrams) easily.

❌ **Cons:**
- Accessibility: PDFs can be hard to read on smaller mobile devices.
- User friction: Requires scrolling/zooming within the PDF viewer.

📊 **Effort:** Medium

---

### Option C: Hybrid Dynamic Platform
Convert "Writing" prompts to text (since they are short) but use embedded PDFs for "Reading" and "Listening" questions while providing a clean side-bar for answer entry.

✅ **Pros:**
- Balanced: Dynamic where it counts (Writing), reliable where accuracy is hard (Reading passages).
- Good compromise for limited development time.

❌ **Cons:**
- Still requires manual extraction of some content.

📊 **Effort:** Medium

---

## 💡 Recommendation

**Option B (PDF Viewer Integration)** is recommended for the first phase. 
Given the complexity of IELTS materials (Reading passages are ~700-900 words, Listening has specific diagram-filling questions), transcripting 4 full sets (12 papers) into JSON is extremely prone to error. By embedding the PDFs, we ensure the "Master Standard" quality is maintained. We can build a high-end **"Exam Interface"** that features:
1. A **Test Selector** (Test 1, 2, 3, 4).
2. A **Skill Switcher** (Listening, Reading, Writing).
3. **Audio Player** for Listening sections.
4. **Side-by-side Layout**: PDF on the left, Input sheet on the right.
5. **Submit to Admin**: Since grading Reading/Listening can be automated with the answer keys, but Writing requires manual teacher grading.

What direction would you like to explore?
