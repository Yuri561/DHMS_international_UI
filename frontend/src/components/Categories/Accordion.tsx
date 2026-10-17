import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const WhyChooseDHMS: React.FC = () => {
    return (
      <Accordion type="single" collapsible className="w-full text-white ">
        <AccordionItem
          value="item-1"
          className="border-none rounded bg-black "
        >
          <AccordionTrigger className="text-white hover:text-[#f3cb50] cursor-pointer">
            Why is DHMS International unique?
          </AccordionTrigger>
          <AccordionContent className="text-white">
            DHMS International celebrates the richness of African beauty, offering
            products that honor diverse hair textures, skin tones, and cultural
            styles — all carefully curated to uplift and empower.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem
          value="item-2"
          className="border-none rounded bg-black"
        >
          <AccordionTrigger className="text-white hover:text-[#f3cb50] cursor-pointer">
            What makes your products stand out?
          </AccordionTrigger>
          <AccordionContent className="text-white">
            We source premium, ethically made beauty products that combine modern
            science with traditional African ingredients — from nourishing oils to
            vibrant hair extensions and accessories.
          </AccordionContent>
        </AccordionItem>
  
        <AccordionItem
          value="item-3"
          className="border-none rounded bg-black"
        >
          <AccordionTrigger className="text-white hover:text-[#f3cb50] cursor-pointer">
            Why should I shop with DHMS International?
          </AccordionTrigger>
          <AccordionContent className="text-white">
            Our store is more than just products — it&apos;s a movement. We champion
            self-expression, cultural pride, and confidence, delivering a shopping
            experience that&apos;s personal, empowering, and beautifully diverse.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  
  export default WhyChooseDHMS
  