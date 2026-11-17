export const evidence = {
  message: {
    title: 'The scholarship message', short: 'Original message', kind: 'MESSAGE', source: 'Jun’s phone · received 14:12',
    text: '“Congratulations, Jun! Your Meadow Fund bursary has been reserved. Pay a 12-leaf verification fee before 18:00 or your place will go to another student. Complete your confirmation using the button below.”',
    detail: 'The message promises an award and asks for a fee under a short deadline. Those claims still need independent checking.',
    observation: 'The sender claims a place is reserved and requires a fee today.'
  },
  destination: {
    title: 'Where the button leads', short: 'Link destination', kind: 'LINK DETAIL', source: 'Message button · inspected without visiting',
    text: 'Displayed label: “Meadow Fund — confirm your bursary”\nActual destination: https://meadow-awards.invalid/verify',
    detail: 'The address behind a button can differ from its label. This is a fictional, inactive address; inspecting it does not visit a website.',
    observation: 'The button points to meadow-awards.invalid. Compare that address with a source obtained independently from the sender.'
  },
  statement: {
    title: 'Jun’s account', short: 'Jun’s statement', kind: 'INTERVIEW', source: 'Jun · visiting student',
    text: '“I applied last week. I put a photo of my application envelope on the town notice feed. I haven’t had a decision yet. The message knew my name, so I thought it must be real.”',
    detail: 'Jun’s application and name were visible to others. Knowing personal details does not, by itself, verify a sender.',
    observation: 'The message’s personal details could have come from a public post.'
  },
  bulletin: {
    title: 'The original bursary notice', short: 'Printed fund notice', kind: 'DOCUMENT', source: 'DDB reference shelf · archived before the message arrived',
    text: 'MEADOW FUND · AUTUMN BURSARIES\nApplications close on the final day of autumn. All applicants receive a decision afterward. Applying and receiving an award are free.\nOfficial address: meadow-fund.invalid\nQuestions: use the contact in the town’s printed directory.',
    detail: 'This independently obtained notice contradicts both the message’s fee and its claim that an award is already reserved.',
    observation: 'No fees are required; decisions have not been sent; the official address differs.'
  },
  confirmation: {
    title: 'A call through the directory', short: 'Independent confirmation', kind: 'VERIFIED ACCOUNT', source: 'Ada · town librarian · call using the printed directory',
    text: '“I called the fund using the number in our printed directory, not the message. They confirmed applications are still open, no awards have been announced, and they never ask for a verification payment.”',
    detail: 'The contact route was obtained separately from the suspicious message. This corroborates the archived notice.',
    observation: 'A separate, trusted contact confirms the fee request and award claim are false.'
  }
} as const;
export type EvidenceId = keyof typeof evidence;
export const evidenceIds = Object.keys(evidence) as EvidenceId[];
export type Conclusion = 'impersonation' | 'genuine' | 'insufficient';
export type Reason = 'corroboration' | 'appearance' | 'urgency';
export const conclusions: {id: Conclusion; title: string; text: string}[] = [
  {id:'impersonation', title:'The message is impersonating the fund', text:'Its claims conflict with independently verified information.'},
  {id:'genuine', title:'The message is a genuine award notice', text:'The sender has shown enough evidence of authorization.'},
  {id:'insufficient', title:'There is not enough evidence yet', text:'Keep the case open and verify the source before acting.'}
];
export const reasons: {id: Reason; text: string}[] = [
  {id:'corroboration',text:'The original message conflicts with both the archived notice and an independently contacted source.'},
  {id:'appearance',text:'Its wording and appearance do not look like an official message.'},
  {id:'urgency',text:'A short deadline alone proves that a message is fraudulent.'}
];
export function assessReport(conclusion: Conclusion, selected: EvidenceId[], reason: Reason | '') {
  if (conclusion === 'insufficient') return {supported:false, title:'A careful pause', text:'It is responsible to hold off when you cannot support a conclusion. Your case stays open. Compare the message with the original notice and Ada’s independent confirmation.'};
  if (conclusion === 'genuine') return {supported:false,title:'That conclusion needs revisiting',text:'Knowing Jun’s name is not proof of authorization. Look for information obtained independently from the sender, and compare the payment and timing claims.'};
  if (!['message','bulletin','confirmation'].every(id=>selected.includes(id as EvidenceId))) return {supported:false,title:'Show the chain of evidence',text:'Attach the original claim, the archived notice, and Ada’s independent confirmation. Together they establish what was said and why it is contradicted.'};
  if (reason !== 'corroboration') return {supported:false,title:'Explain what the evidence establishes',text:'Appearance and urgency can prompt caution, but do not prove deception on their own. Explain how separate sources contradict the sender’s claims.'};
  return {supported:true,title:'A conclusion you can stand behind',text:'The fee and award claims are contradicted by two independent checks. The mismatched destination reinforces the finding. Jun can keep the message as evidence, avoid the payment, and use the fund’s verified contact. We have not established who sent it.'};
}
