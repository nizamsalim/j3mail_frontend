import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How does J3Mail ensure email security?",
      answer:
        "J3Mail uses end-to-end encryption, ensuring that only the sender and the recipient can read the emails. Your emails remain private and secure from unauthorized access.",
    },
    {
      question: "What encryption methods does J3Mail use?",
      answer:
        "We implement AES, RSA, and ECC encryption techniques to protect email content, ensuring top-tier security against cyber threats.",
    },
    {
      question: "Can I recover my encrypted emails if I forget my password?",
      answer:
        "No, since we use strong encryption, we do not store or have access to your password. However, you can reset your account using recovery methods.",
    },
    {
      question: "Is J3Mail free to use?",
      answer:
        "J3Mail offers a free version with basic encryption features. Premium plans include enhanced security options and additional storage.",
    },
    {
      question: "Does J3Mail prevent phishing attacks?",
      answer:
        "Yes, J3Mail has built-in anti-phishing measures, including sender verification and encrypted authentication, to prevent spoofed emails.",
    },
  ];

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
