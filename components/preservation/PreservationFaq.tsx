import Link from "next/link";
import type { ReactNode } from "react";

const FAQ: { question: string; answer: ReactNode }[] = [
  {
    question: "How quickly can I start?",
    answer:
      "Your bucket is usually created within a few minutes of payment. You'll get a portal activation email and a welcome email with your bucket name and connection details.",
  },
  {
    question: "What can I connect?",
    answer:
      "Any S3-compatible client or application: the AWS CLI, rclone, Cyberduck, and backup or archive software with an S3 target.",
  },
  {
    question: "What does write-once mean for me?",
    answer:
      "Data written to optical media can't be altered afterwards, which is what makes it suited to preservation. It also means overwriting or deleting an object doesn't erase what was written, so preserve finished material rather than working files.",
  },
  {
    question: "What happens if I store more than my plan?",
    answer:
      "Nothing stops working. Each additional terabyte (partial terabytes round up) is added to your next invoice at your plan's per-TB rate. When you reach the next plan's size, your whole account moves to that plan's lower rate, and we email you when it happens.",
  },
  {
    question: "Can I move to a smaller plan?",
    answer:
      "No. Because preserved data stays on write-once media, plans grow with your collection but don't move down.",
  },
  {
    question: "How do I delete data?",
    answer:
      "Preserved data is only removed through a deletion request approved by Savartus, so nothing is lost by accident or by a compromised key. Contact us to start one.",
  },
  {
    question: "Where is my data stored?",
    answer: "In a Savartus optical library in our facility in Wisconsin, USA.",
  },
  {
    question: "How do I cancel?",
    answer: (
      <>
        Email info@savartus.com from your account email. Preserved data is never deleted
        automatically; what happens to it after cancellation is set out in the{" "}
        <Link href="/preservation/terms">service terms</Link>.
      </>
    ),
  },
  {
    question: "Need more than 25 TB, or your own library?",
    answer: (
      <>
        Larger collections and on-premises optical libraries are available.{" "}
        <Link href="/contact">Talk to us</Link>.
      </>
    ),
  },
];

export function PreservationFaq() {
  return (
    <div className="preservation-faq">
      <h2>Questions</h2>
      {FAQ.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
