import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MockTest from '@/models/MockTest';

export async function GET() {
    try {
        await dbConnect();

        const test03 = {
            name: "Academic Test 03 - Professional Sample",
            category: "IELTS",
            listening: {
                pdf: "/academic_tests/test_03/listening/listening.pdf",
                totalQuestions: 40,
                sections: [
                    {
                        title: "Section 1: Student Job Enquiries",
                        audioUrl: "/academic_tests/test_03/listening/audio/section01.mp3",
                        questionsCount: 10,
                        content: `<h3>Questions 1 and 2</h3>
<p>Complete the notes below. Write <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.</p>
<p><em>Example: Type of job required: Part-time</em></p>
<p>Student is studying [Q1].</p>
<p>Student is in the [Q2] year of the course.</p>

<h3>Questions 3-5</h3>
<p>Complete the table below. Write <strong>NO MORE THAN TWO WORDS</strong> for each answer.</p>
<table>
  <thead>
    <tr>
      <th>Position Available</th>
      <th>Where</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Receptionist</td>
      <td>in the [Q3]</td>
    </tr>
    <tr>
      <td>[Q4]</td>
      <td>in the Child Care Centre</td>
    </tr>
    <tr>
      <td>Clerical Assistant</td>
      <td>in the [Q5]</td>
    </tr>
  </tbody>
</table>

<h3>Questions 6-10</h3>
<p>Complete the form below. Write <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.</p>
<div style="background: #f8fafc; padding: 2rem; border-radius: 1.5rem; border: 1px solid #e2e8f0;">
  <p><strong>STUDENT DETAILS</strong></p>
  <p>Name: Anita Newman</p>
  <p>Address: [Q6]</p>
  <p>Room No. [Q7]</p>
  <p>Other skills: Speaks some Japanese</p>
  <p>Position available: [Q8] at the English Language Centre</p>
  <p>Duties: Respond to enquiries and [Q9]</p>
  <p>Time of interview: Friday at [Q10] a.m.</p>
</div>`,
                        answers: {
                            "1": "Engineering",
                            "2": "first",
                            "3": "Health Centre",
                            "4": "Cleaner",
                            "5": "Library",
                            "6": "14 Marshall Street",
                            "7": "B65",
                            "8": "Receptionist",
                            "9": "filing",
                            "10": "10.30"
                        }
                    },
                    {
                        title: "Section 2: Sponsored Walking Holiday",
                        audioUrl: "/academic_tests/test_03/listening/audio/section02.mp3",
                        questionsCount: 10,
                        content: `<h3>Questions 11-16</h3>
<p>Choose the correct letter, <strong>A, B or C</strong>.</p>
<p><strong>11 On the holiday, you will be walking for</strong><br/>
[Q11] A 6 days. B 8 days. C 10 days.</p>
<p><strong>12 What proportion of the sponsorship money goes to charity?</strong><br/>
[Q12] A 10% B 25% C 50%</p>
<p><strong>13 Each walker's sponsorship money goes to one</strong><br/>
[Q13] A student. B teacher. C school.</p>
<p><strong>14 When you start the trek you must be</strong><br/>
[Q14] A interested in getting fit. B already quite fit. C already very fit.</p>
<p><strong>15 As you walk you will carry</strong><br/>
[Q15] A all of your belongings. B some of your belongings. C none of your belongings.</p>
<p><strong>16 The Semira Region has a long tradition of</strong><br/>
[Q16] A making carpets. B weaving blankets. C carving wood.</p>

<h3>Questions 17-20</h3>
<p>Complete the form below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>
<p><strong>ITINERARY</strong></p>
<p>Day 1 arrive in Kishba</p>
<p>Day 2 rest day</p>
<p>Day 3 spend all day in a [Q17]</p>
<p>Day 4 visit a school</p>
<p>Day 5 rest day</p>
<p>Day 6 see a [Q18] with old carvings</p>
<p>Day 7 rest day</p>
<p>Day 8 swim in a [Q19]</p>
<p>Day 9 visit a [Q20]</p>`,
                        answers: {
                            "11": "B",
                            "12": "C",
                            "13": "A",
                            "14": "B",
                            "15": "C",
                            "16": "A",
                            "17": "mountain",
                            "18": "palace",
                            "19": "waterfall",
                            "20": "market"
                        }
                    }
                ]
            },
            reading: {
                pdf: "/academic_tests/test_03/reading/reading.pdf",
                totalQuestions: 40,
                sections: [
                    {
                        title: "Reading Passage 1",
                        questionsCount: 13,
                        content: `<h3>Questions 1-5</h3>
<p>Do the following statements agree with the information given in Reading Passage 1?</p>
<p><strong>TRUE</strong> if the statement agrees with the information<br/><strong>FALSE</strong> if the statement contradicts the information<br/><strong>NOT GIVEN</strong> if there is no information on this</p>
<p>1 The first passage is about the history of ocean research. [Q1]</p>
<p>2 Scientists used robotic floats to study salinity. [Q2]</p>

<h3>Questions 6-13</h3>
<p>Complete the summary below. Choose <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.</p>
<p>The Robotic Float Project utilizes floats shaped like a [Q6]. Data collected helps experts understand [Q7] and naval rescues.</p>`,
                        answers: {
                            "1": "TRUE",
                            "2": "TRUE",
                            "6": "cylinder",
                            "7": "climate change"
                        }
                    }
                ]
            },
            writing: {
                pdf: "/academic_tests/test_03/writing/writing.pdf",
                tasksCount: 2,
                content: `<h3>Writing Task 1</h3>
<p>The chart below shows the number of students... Write at least 150 words.</p>

<h3>Writing Task 2</h3>
<p>Some people think that universities should provide knowledge and skills... Discuss both views and give your opinion. Write at least 250 words.</p>`
            }
        };

        // For simplicity, we just add it to the existing tests or replace
        // In a real scenario, we might want to check if it already exists
        await MockTest.deleteMany({ name: test03.name });
        await MockTest.create(test03);

        return NextResponse.json({ success: true, message: "Sample test seeded successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
