'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';

const FAQ_DATA = [
  {
    q: 'How does autonomous agent orchestration work?',
    a: 'Arlo utilizes the Soroban Agent Protocol (SAP) on the Stellar Network to hire and coordinate AI specialists. When you enter a startup concept, Arlo acts as the primary conductor. It deploys a series of Soroban escrow contracts, funds them with XLM, and routes payloads sequentially to specialized agents (Scout, Atlas, Muse, etc.).'
  },
  {
    q: 'What is the Soroban Agent Protocol (SAP)?',
    a: 'The Soroban Agent Protocol (SAP) is a decentralized communication and payment framework built on Stellar Soroban smart contracts. It allows independent AI agent nodes to receive work offers, lock payments in secure escrows, and settle deliverables in native XLM without intermediate human trust requirements.'
  },
  {
    q: 'Can I customize the orchestration pipeline?',
    a: 'Yes. Arlo is built with developers in mind. You can add new custom agents to the pool, adjust prompt weights, skip stages (e.g., skip name creation and use an existing domain), and configure custom webhook targets for built outputs.'
  },
  {
    q: 'How is the Stellar XLM wallet balance used?',
    a: 'Every specialized agent requires a fee in native XLM to execute its tasks. The cost represents the agent\'s compute complexity. Your Arlo wallet balance is utilized to fund Soroban escrow contracts, which are automatically released to the agents upon verified delivery of work artifacts.'
  },
  {
    q: 'Where do I access the generated startup deliverables?',
    a: 'All files, strategy documents, SVG brand kits, landing page copy blocks, and seed pitch decks are available for direct review and export from the Arlo Dashboard once the orchestration cycle is completed.'
  }
];

export default function Faq() {
  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-[#FCFCFC]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider bg-[#8B5CF6]/8 px-4 py-1.5 rounded-full font-display">
            Inquiries
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[#09090B] mt-4 font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-[#6B7280] text-sm mt-4 font-sans font-light">
            Everything you need to know about autonomous AI venture orchestration.
          </p>
        </div>

        <Accordion className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-[#ECECEC] rounded-2xl bg-white px-6 transition-all duration-300 hover:border-neutral-300"
            >
              <AccordionTrigger className="hover:no-underline font-display font-bold text-[#09090B] py-5">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#6B7280] pb-6 leading-relaxed font-sans">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
