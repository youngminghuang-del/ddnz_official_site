import type { CandidateLocale, StandardCandidateCountry } from './model';

const marketDecisionCopy = {
  'united-kingdom': {
    quoteNav: 'Southampton quotes',
    quoteHeading: 'Compare Southampton sea freight and delivery to your postcode',
    port: 'Southampton port collection',
    portIntro: 'Compare full-container freight (FCL) to the named terminal and groupage (LCL) to the named unpacking depot. Ask for destination handling and release charges separately from ocean freight.',
    portQuote: 'Quote Southampton collection',
    rateLink: 'See Southampton rates and transit',
    door: 'Door-to-door delivery in Great Britain',
    doorIntro: 'Use the same Southampton arrival and final postcode to compare port collection with delivery. Provide the unloading setup and warehouse booking window.',
    doorDetails: 'Check what the delivery quote includes',
    doorRows: [
      ['Terminal or depot pickup', 'Name the haulier. For FCL, price the terminal collection slot and empty return. For LCL, name the depot and price delivery after unpacking.'],
      ['Delivery at the postcode', 'Identify who books the warehouse slot, supplies unloading equipment and pays for truck waiting or a second delivery attempt.'],
      ['Customs and tax', 'Name the importer and broker. Show brokerage, customs duty and import VAT separately and state who pays each.'],
    ],
    doorQuote: 'Quote delivery to a GB postcode',
    clearance: 'UK importer and broker handoff',
    clearanceDetails: 'Confirm the division of work',
    steps: [
      'Name the importer, confirm the applicable EORI and record who mandates the customs agent. Flag Northern Ireland separately before quoting.',
      'Send the agent the product codes, invoice values and agreed delivery terms. Confirm who will account for import VAT and settle duty.',
      'Agree who confirms customs and carrier release with the haulier and who pays costs if collection is delayed.',
    ],
    clearanceQuote: 'Request UK clearance coordination',
    documentNav: 'UK broker and collection documents',
    documentHeading: 'Prepare the UK broker pack and Southampton collection details',
    documents: [
      ['Commercial invoice for the broker', 'Supply the importer and seller details, product descriptions, country of origin, values and currency. Give the broker the applicable EORI and Incoterm with its named place.'],
      ['Packing list for the haulier', 'List each pallet or crate with its dimensions and gross weight. Tell the haulier which items need a forklift and give the receiving postcode and delivery booking reference when available.'],
      ['Transport document for release', 'For ocean freight, check the bill of lading or sea waybill against the booking. Confirm the named Southampton terminal or LCL depot, release instructions and the party authorised to collect.'],
    ],
    documentText: 'Send the broker the invoice and packing list before dispatch. Share the release instructions with the haulier before booking collection. For Northern Ireland, have the broker confirm which procedure and identifiers apply to the actual route.',
  },
  philippines: {
    quoteNav: 'Manila cost comparison',
    quoteHeading: 'Compare China-to-Philippines shipping costs through Manila',
    port: 'FCL to the booked Manila terminal',
    portIntro: 'Compare Shenzhen and Nansha sailings with the same container size and cargo-ready date. Ask the carrier to give the exact discharge terminal for each North or South rate label and list terminal handling and carrier release charges.',
    portQuote: 'Quote a Manila terminal arrival',
    rateLink: 'Compare Manila rate references',
    door: 'Manila terminal to your warehouse',
    doorIntro: 'Add the receiving city and address to the same Manila quote. Give the trucker the unloading window and any vehicle or site access limits.',
    doorDetails: 'Check the charges after discharge',
    doorRows: [
      ['Release and pickup', 'Name the broker responsible for customs release and the party arranging carrier release. Ask who books the terminal pickup and pays terminal storage or demurrage if release is late.'],
      ['Trucking and empty return', 'Get separate lines for the warehouse trip, waiting or unloading, and empty return. Ask for the return depot, free time and who pays detention if the empty is returned late.'],
      ['Import charges', 'Name the Philippine importer and broker. Confirm who pays brokerage and advances duty and import taxes, and whether those amounts sit outside the freight quote.'],
    ],
    doorQuote: 'Quote Manila-to-warehouse delivery',
    clearance: 'Philippine importer and cargo release',
    clearanceDetails: 'Confirm who files and releases the cargo',
    steps: [
      'Identify the Philippine importer and its broker. Ask them to confirm applicable Bureau of Customs accreditation and who will file the goods declaration through E2M.',
      'Ask the broker to confirm the tariff classification and permits for the commodity before loading. Agree who pays duty, taxes and brokerage.',
      'Agree who obtains carrier release and passes the pickup instructions to the trucker after customs release. Recheck the terminal if the carrier changes the booking.',
    ],
    clearanceQuote: 'Request Manila clearance coordination',
    documentNav: 'Manila release paperwork',
    documentHeading: 'Check the paperwork before Manila release',
    documents: [
      ['Invoice for the Philippine declaration', 'Give the importer or broker the descriptions, transaction values and country of origin. Have them reconcile the invoice with the declaration and confirm permits for regulated goods.'],
      ['Packing list for discharge and trucking', 'Match carton or pallet marks, counts and gross weights to the shipment. Send the receiving address and unloading requirements separately so the trucker can confirm access.'],
      ['Bill of lading and terminal handoff', 'Check the consignee, discharge port and container details against the booking. Obtain the exact discharge terminal and release instructions separately from the carrier, then pass them to the broker and trucker.'],
    ],
    documentText: 'If the terminal changes, ask for the revised booking and check whether the bill of lading draft needs an amendment. Reconfirm release and pickup references, the truck quote and the empty-return depot.',
  },
} as const;

export function getMarketDecisionCopy(country: StandardCandidateCountry, locale: CandidateLocale) {
  if (locale !== 'en') return undefined;
  if (country === 'united-kingdom' || country === 'philippines') return marketDecisionCopy[country];
}
