export type PartType = 'prefix' | 'root' | 'suffix';
export type WorldId = 'planet' | 'forest' | 'city';

export interface ExampleWord {
  word: string;
  definition: string;
  sentence: string;
}

export interface WordPart {
  id: string;
  part: string; // e.g. "pre-" or "port" or "-able"
  type: PartType;
  world: WorldId;
  meaning: string;
  origin: string;
  difficulty: 1 | 2 | 3;
  clue: string; // visual mnemonic
  examples: ExampleWord[];
  related?: string[];
  satNote: string; // why it matters for the SAT
}

export const WORLD_META: Record<
  WorldId,
  { name: string; tagline: string; hue: string }
> = {
  planet: { name: 'Prefix Planet', tagline: 'Directional & modifying prefixes', hue: 'violet' },
  forest: { name: 'Root Forest', tagline: 'Classical roots & word families', hue: 'teal' },
  city: { name: 'Suffix City', tagline: 'Endings that change meaning or grammar', hue: 'coral' },
};

const P = (
  id: string,
  part: string,
  meaning: string,
  origin: string,
  difficulty: 1 | 2 | 3,
  clue: string,
  examples: [string, string, string][],
  satNote: string,
  related?: string[],
): WordPart => ({
  id,
  part,
  type: part.startsWith('-') ? 'suffix' : part.endsWith('-') ? 'prefix' : 'root',
  world: part.startsWith('-') ? 'city' : part.endsWith('-') ? 'planet' : 'forest',
  meaning,
  origin,
  difficulty,
  clue,
  examples: examples.map(([word, definition, sentence]) => ({ word, definition, sentence })),
  satNote,
  related,
});

export const WORD_PARTS: WordPart[] = [
  // ------------------------------ PREFIXES ------------------------------
  P('pre-a', 'a-/an-', 'not, without', 'Greek', 2, 'A is for "absent" — the a- is missing.', [
    ['atypical', 'not typical; unusual', 'Her atypical approach to the puzzle surprised the judges.'],
    ['anarchy', 'absence of government; chaos', 'Without a leader, the club descended into anarchy.'],
  ], 'Signals negation in SAT words like amoral, apathy, and asymmetrical.', ['pre-in', 'pre-dys']),

  P('pre-ab', 'ab-', 'away from', 'Latin', 2, 'Think "absent" — something has gone away.', [
    ['abnormal', 'deviating from what is normal', 'The test detected abnormal levels in the sample.'],
    ['abscond', 'to leave secretly and hide', 'The treasurer absconded with the funds overnight.'],
  ], 'Appears in abstract, absent, and abduct — a classic "away" prefix.'),

  P('pre-ad', 'ad-', 'to, toward', 'Latin', 2, 'Ad- points like an arrow toward a target.', [
    ['advocate', 'to publicly support or recommend', 'Senators advocate for the new education bill.'],
    ['adjacent', 'next to or near something', 'The library is adjacent to the main hall.'],
  ], 'Often hidden by spelling changes: ac-, af-, ag-, ap-, as-, at-.', ['pre-a']),

  P('pre-ambi', 'ambi-', 'both, around', 'Latin', 3, 'Ambidextrous people use both hands.', [
    ['ambiguous', 'open to more than one interpretation', 'His ambiguous answer left everyone guessing.'],
    ['ambivalent', 'having mixed or contradictory feelings', 'She felt ambivalent about moving abroad.'],
  ], 'Ambiguous and ambivalent are frequent SAT "tone" words.'),

  P('pre-ante', 'ante-', 'before', 'Latin', 2, 'Ante- comes before, like an antechamber before a hall.', [
    ['antecedent', 'a thing that existed before; a precursor', 'The novel’s antecedent was a short story.'],
    ['antediluvian', 'ridiculously old-fashioned', 'His antediluvian computer still used floppy disks.'],
  ], 'Contrast with post- (after) and pre- (before in preparation).', ['pre-post', 'pre-pre']),

  P('pre-anti', 'anti-', 'against, opposite', 'Greek', 1, 'Antibodies fight against invaders.', [
    ['antipathy', 'a deep-seated feeling of dislike', 'Their mutual antipathy was impossible to hide.'],
    ['antithesis', 'the direct opposite of something', 'Her calm was the antithesis of his panic.'],
  ], 'Antithesis and antipathy are high-frequency SAT vocabulary.', ['pre-contra', 'pre-pro']),

  P('pre-auto', 'auto-', 'self', 'Greek', 1, 'An automobile moves itself.', [
    ['autonomous', 'self-governing; independent', 'The region became autonomous after the vote.'],
    ['autodidact', 'a self-taught person', 'An autodidact, she learned coding from books.'],
  ], 'Pairs with roots: autonomy = self + law.'),

  P('pre-bene', 'bene-', 'good, well', 'Latin', 1, 'Benefits are good things you receive.', [
    ['benevolent', 'kindly and charitable', 'The benevolent donor funded the new school.'],
    ['benefactor', 'a person who gives help or money', 'An anonymous benefactor paid the debt.'],
  ], 'Confusing-pair alert: bene- (good) vs mal- (bad).', ['pre-mal']),

  P('pre-bi', 'bi-', 'two', 'Latin', 1, 'A bicycle has two wheels.', [
    ['bipartisan', 'supported by two political parties', 'The bill won bipartisan approval.'],
    ['bifurcate', 'to divide into two branches', 'The trail bifurcates at the old oak.'],
  ], 'Counting prefixes bi-, tri-, quad- appear in math and reading sections.'),

  P('pre-circum', 'circum-', 'around', 'Latin', 2, 'Circles go all the way around.', [
    ['circumnavigate', 'to sail or travel all the way around', 'They circumnavigated the globe in eighty days.'],
    ['circumspect', 'wary and unwilling to take risks', 'Be circumspect before signing the contract.'],
  ], 'Circumspect and circuitous are classic SAT adjectives.'),

  P('pre-con', 'co-/con-', 'together, with', 'Latin', 1, 'Co-workers work together.', [
    ['converge', 'to come together from different directions', 'The rivers converge near the delta.'],
    ['consensus', 'a general agreement', 'The committee finally reached a consensus.'],
  ], 'Spelling shifts to com-, col-, cor- before certain letters.'),

  P('pre-contra', 'contra-', 'against, opposite', 'Latin', 2, 'A contradiction speaks against itself.', [
    ['contradict', 'to assert the opposite of', 'The data contradicts his earlier claim.'],
    ['controversy', 'a prolonged public dispute', 'The ruling sparked months of controversy.'],
  ], 'Cousin of anti-: both mean "against".', ['pre-anti']),

  P('pre-de', 'de-', 'down, away, reverse', 'Latin', 1, 'Descend means to go down.', [
    ['deplete', 'to use up; to diminish seriously', 'Drought depleted the reservoir.'],
    ['denounce', 'to publicly declare wrong or evil', 'Critics denounced the policy as unfair.'],
  ], 'One of the most common prefixes on the SAT: devalue, deflect, deplete.'),

  P('pre-dis', 'dis-', 'not, apart, away', 'Latin', 1, 'Disagree = not agree.', [
    ['dissonance', 'a lack of harmony; tension', 'The dissonance between words and actions was clear.'],
    ['disseminate', 'to spread widely', 'The journal disseminates new research.'],
  ], 'Watch for dis- in discourse, disparity, and dispassionate.', ['pre-dys']),

  P('pre-dys', 'dys-', 'bad, difficult, faulty', 'Greek', 3, 'Dysfunction = bad functioning.', [
    ['dystopia', 'an imagined, wretched society', 'The novel depicts a dystopia ruled by algorithms.'],
    ['dyspeptic', 'irritable; suffering indigestion', 'The dyspeptic critic panned every film.'],
  ], 'The Greek twin of Latin mal-: both mean "bad".', ['pre-mal', 'pre-dis']),

  P('pre-ex', 'e-/ex-', 'out of, from', 'Latin', 1, 'Exit means to go out.', [
    ['exonerate', 'to officially clear of blame', 'New evidence exonerated the defendant.'],
    ['elaborate', 'detailed and complex', 'She proposed an elaborate three-stage plan.'],
  ], 'Ex- often intensifies too: exhaustive, excruciating.'),

  P('pre-en', 'en-/em-', 'to put into; to cause', 'Greek/Latin', 2, 'Enclose = put into a closed space.', [
    ['empower', 'to give power or authority to', 'The program empowers young scientists.'],
    ['engender', 'to cause or give rise to', 'The scandal engendered deep distrust.'],
  ], 'Engender and embellish show the "cause to be" sense.'),

  P('pre-epi', 'epi-', 'upon, over, after', 'Greek', 3, 'An epilogue sits upon the end of a book.', [
    ['ephemeral', 'lasting a very short time', 'Fame proved ephemeral for the band.'],
    ['epitome', 'a perfect example of a quality', 'She is the epitome of patience.'],
  ], 'Ephemeral is a perennial SAT favorite for "short-lived".'),

  P('pre-eu', 'eu-', 'good, well', 'Greek', 3, 'Euphoria = a good feeling carried through you.', [
    ['euphemism', 'a mild expression for something harsh', '"Let go" is a euphemism for "fired".'],
    ['eulogy', 'a speech praising someone who has died', 'His eulogy moved the entire chapel.'],
  ], 'Opposite of dys-: eu- (good) vs dys- (bad).', ['pre-dys']),

  P('pre-extra', 'extra-', 'beyond, outside', 'Latin', 1, 'Extraordinary = beyond ordinary.', [
    ['extraneous', 'irrelevant; not essential', 'Delete the extraneous details from the report.'],
    ['extrapolate', 'to estimate by extending known data', 'Analysts extrapolate future sales from trends.'],
  ], 'Extraneous is a favorite in SAT "relevance" questions.'),

  P('pre-fore', 'fore-', 'before, in front', 'Old English', 2, 'A forehead is the front of the head.', [
    ['foreshadow', 'to hint at what is to come', 'The storm clouds foreshadow the ending.'],
    ['foresight', 'the ability to anticipate needs', 'Her foresight saved the company millions.'],
  ], 'Native English cousin of Latin ante- and pre-.', ['pre-ante']),

  P('pre-hyper', 'hyper-', 'over, excessive', 'Greek', 1, 'Hyperactive = over-active.', [
    ['hyperbole', 'deliberate exaggeration', '"I’ve told you a million times" is hyperbole.'],
    ['hypersensitive', 'excessively sensitive', 'He grew hypersensitive to criticism.'],
  ], 'Confusing pair: hyper- (too much) vs hypo- (too little).', ['pre-hypo']),

  P('pre-hypo', 'hypo-', 'under, too little', 'Greek', 2, 'Hypothermia = too little body heat.', [
    ['hypothesis', 'a proposed, testable explanation', 'Her hypothesis predicted the reaction.'],
    ['hypocritical', 'pretending to hold beliefs one violates', 'It felt hypocritical to lecture while littering.'],
  ], 'Do not confuse with hyper- — a classic trap pair.', ['pre-hyper']),

  P('pre-in', 'in-/im-', 'not', 'Latin', 1, 'Impossible = not possible.', [
    ['inevitable', 'certain to happen; unavoidable', 'Change is inevitable in any industry.'],
    ['implausible', 'not seeming reasonable or likely', 'His excuse struck the jury as implausible.'],
  ], 'Spelling shifts: il- (illegal), ir- (irregular), im- (impossible).'),

  P('pre-inter', 'inter-', 'between, among', 'Latin', 1, 'International = between nations.', [
    ['intervene', 'to come between to alter a result', 'Teachers intervened before the conflict grew.'],
    ['interim', 'a temporary in-between period', 'An interim manager ran the department.'],
  ], 'Compare inter- (between) with intra- (within).', ['pre-intra']),

  P('pre-intra', 'intra-', 'within, inside', 'Latin', 2, 'Intravenous = within a vein.', [
    ['intramural', 'within a single institution', 'She plays intramural soccer at college.'],
    ['intractable', 'hard to control or solve', 'The conflict seemed intractable for decades.'],
  ], 'Intractable literally means "not able to be pulled/managed".', ['pre-inter']),

  P('pre-mal', 'mal-', 'bad, evil', 'Latin', 1, 'Malicious = intending bad things.', [
    ['malevolent', 'wishing harm to others', 'The villain’s malevolent grin chilled the room.'],
    ['malady', 'a disease or ailment', 'The doctor diagnosed a rare malady.'],
  ], 'Mirror of bene-: malevolent vs benevolent.', ['pre-bene']),

  P('pre-micro', 'micro-', 'small', 'Greek', 1, 'A microscope shows small things.', [
    ['micromanage', 'to control every small detail', 'Good mentors avoid micromanaging interns.'],
    ['microcosm', 'a small world reflecting a larger one', 'The school is a microcosm of society.'],
  ], 'Opposite of macro- and mega-.', []),

  P('pre-mis', 'mis-', 'wrong, badly', 'Old English', 1, 'Mistake = take wrongly.', [
    ['misconstrue', 'to interpret wrongly', 'Do not misconstrue my silence as consent.'],
    ['misnomer', 'a wrong or inaccurate name', '"Koala bear" is a misnomer — it’s a marsupial.'],
  ], 'Misnomer is a recurring SAT word.'),

  P('pre-mono', 'mono-', 'one, single', 'Greek', 1, 'A monocycle has one wheel.', [
    ['monotonous', 'dull from lack of variety', 'The monotonous lecture tested our focus.'],
    ['monolithic', 'large, single, and uniform', 'The company was once a monolithic empire.'],
  ], 'Counting prefix family: mono-, bi-, tri-, poly-.', ['pre-poly']),

  P('pre-multi', 'multi-', 'many', 'Latin', 1, 'Multimedia = many media.', [
    ['multifaceted', 'having many aspects', 'The crisis demanded a multifaceted response.'],
    ['multitude', 'a large number', 'A multitude of stars filled the desert sky.'],
  ], 'Latin "many"; Greek equivalent is poly-.', ['pre-poly']),

  P('pre-non', 'non-', 'not', 'Latin', 1, 'Nonfiction = not fiction.', [
    ['nonchalant', 'casually calm and unconcerned', 'She gave a nonchalant shrug.'],
    ['nonentity', 'a person of no importance', 'He feared becoming a political nonentity.'],
  ], 'Nonchalant hides non- + chalant ("warm" — so, not heated).'),

  P('pre-ob', 'ob-', 'against, toward, over', 'Latin', 2, 'Object = throw against.', [
    ['obstinate', 'stubbornly refusing to change', 'The obstinate mule refused to move.'],
    ['obscure', 'not well known; unclear', 'The poem’s meaning remained obscure.'],
  ], 'Often disguised as oc-, of-, op- (occur, offer, oppose).'),

  P('pre-omni', 'omni-', 'all', 'Latin', 2, 'Omnivores eat all kinds of food.', [
    ['omniscient', 'knowing everything', 'The omniscient narrator reveals every thought.'],
    ['omnipresent', 'present everywhere', 'Smartphones feel omnipresent today.'],
  ], 'Omniscient narrators appear in SAT literature passages.'),

  P('pre-over', 'over-', 'too much, above', 'Old English', 1, 'Overflow = flow over the top.', [
    ['overt', 'open and observable; not hidden', 'The policy drew overt criticism.'],
    ['overwrought', 'excessively nervous or elaborate', 'His overwrought prose buried the point.'],
  ], 'Overt vs covert is a favorite antonym pair.'),

  P('pre-para', 'para-', 'beside, beyond', 'Greek', 3, 'A parallel line runs beside another.', [
    ['paradox', 'a seemingly self-contradictory truth', 'It is a paradox that scarcity bred abundance.'],
    ['paragon', 'a model of excellence', 'She is a paragon of civic virtue.'],
  ], 'Paradox and paragon are dense SAT Reading words.'),

  P('pre-per', 'per-', 'through, thoroughly', 'Latin', 2, 'Permeate = soak through.', [
    ['pervasive', 'spreading widely throughout', 'A pervasive silence filled the museum.'],
    ['perspicacious', 'having keen insight', 'Her perspicacious review caught every flaw.'],
  ], 'Pervasive and peruse both trace to per-.'),

  P('pre-peri', 'peri-', 'around', 'Greek', 2, 'Perimeter = the measure around.', [
    ['peripheral', 'on the edge; of minor importance', 'Keep side issues peripheral to the argument.'],
    ['peripatetic', 'traveling from place to place', 'The peripatetic tutor taught in four towns.'],
  ], 'Greek "around"; Latin equivalent is circum-.', ['pre-circum']),

  P('pre-poly', 'poly-', 'many', 'Greek', 2, 'A polygon has many angles.', [
    ['polyglot', 'a person who knows many languages', 'The polyglot translated five speeches.'],
    ['polychromatic', 'having many colors', 'The mural burst in polychromatic spirals.'],
  ], 'Greek twin of Latin multi-.', ['pre-multi', 'pre-mono']),

  P('pre-post', 'post-', 'after', 'Latin', 1, 'Postpone = place after.', [
    ['posterity', 'all future generations', 'She saved the letters for posterity.'],
    ['posthumous', 'occurring after death', 'The posthumous novel became a classic.'],
  ], 'Opposite of ante- and pre-.', ['pre-ante']),

  P('pre-pre', 'pre-', 'before', 'Latin', 1, 'Preview = view before.', [
    ['precocious', 'developed earlier than usual', 'The precocious child read novels at six.'],
    ['preclude', 'to make impossible in advance', 'His injury precluded further play.'],
  ], 'Preclude, precursor, and precocious all begin the "before" family.', ['pre-ante']),

  P('pre-pro', 'pro-', 'forward, for, in favor of', 'Latin/Greek', 1, 'Proceed = go forward.', [
    ['proponent', 'a person who argues in favor', 'She is a vocal proponent of reform.'],
    ['prolific', 'producing abundant work', 'The prolific author wrote forty novels.'],
  ], 'Opponent word: anti-. Proponent vs opponent is a classic pair.', ['pre-anti']),

  P('pre-re', 're-', 'again, back', 'Latin', 1, 'Rewind = wind back again.', [
    ['reiterate', 'to say again for emphasis', 'Let me reiterate the safety rules.'],
    ['resilient', 'able to spring back; tough', 'Resilient ecosystems recover after fires.'],
  ], 'The most common English prefix; watch for the "back" sense in rescind.'),

  P('pre-retro', 'retro-', 'backward, behind', 'Latin', 2, 'Retrospect = look backward.', [
    ['retroactive', 'taking effect from a past date', 'The raise was retroactive to January.'],
    ['retrograde', 'moving backward; declining', 'Cutting the program would be retrograde.'],
  ], 'Pairs with pro-: retrograde vs progress.', ['pre-pro']),

  P('pre-semi', 'semi-', 'half, partly', 'Latin', 1, 'A semicircle is half a circle.', [
    ['seminal', 'strongly influencing later work', 'Her seminal paper reshaped the field.'],
    ['semiprecious', 'of lesser value than precious', 'Amethyst is a semiprecious stone.'],
  ], 'Note: seminal keeps the "seed/origin" sense, not "half".'),

  P('pre-sub', 'sub-', 'under, below', 'Latin', 1, 'A submarine goes under the sea.', [
    ['subordinate', 'lower in rank or importance', 'He subordinated ego to teamwork.'],
    ['subtle', 'delicate; not obvious', 'A subtle shift in tone betrayed her doubt.'],
  ], 'Subtle is famously misread — remember the b is silent.'),

  P('pre-super', 'super-', 'above, over', 'Latin', 1, 'A supervisor watches from above.', [
    ['superfluous', 'more than enough; unnecessary', 'Cut superfluous adjectives from the essay.'],
    ['supersede', 'to take the place of', 'The new rules supersede the old ones.'],
  ], 'Superfluous is one of the most-tested "extra" words.'),

  P('pre-syn', 'syn-/sym-', 'together, with', 'Greek', 2, 'A symphony sounds together.', [
    ['synthesis', 'the combination of parts into a whole', 'Her essay was a synthesis of both views.'],
    ['sympathy', 'sharing another’s feelings', 'He offered sympathy after the loss.'],
  ], 'Synthesis questions on the SAT literally ask you to put ideas "together".', ['pre-con']),

  P('pre-trans', 'trans-', 'across, beyond', 'Latin', 1, 'Transport = carry across.', [
    ['transient', 'lasting only a short time', 'The transient crowd scattered at dusk.'],
    ['transparent', 'see-through; obvious', 'The committee promised transparent decisions.'],
  ], 'Transient and transitory are twin SAT adjectives for "brief".'),

  P('pre-ultra', 'ultra-', 'beyond, extreme', 'Latin', 2, 'Ultraviolet is beyond violet.', [
    ['ulterior', 'hidden beyond what is shown', 'He suspected an ulterior motive.'],
    ['ultramodern', 'extremely modern', 'The ultramodern lab opened last spring.'],
  ], 'Ulterior motives appear constantly in SAT fiction passages.'),

  P('pre-un', 'un-', 'not, reverse of', 'Old English', 1, 'Untie = reverse tying.', [
    ['unprecedented', 'never done or known before', 'The storm brought unprecedented flooding.'],
    ['unscrupulous', 'having no moral principles', 'Unscrupulous dealers sold fake tickets.'],
  ], 'Unprecedented is a top-50 SAT adjective.'),

  P('pre-uni', 'uni-', 'one', 'Latin', 1, 'A unicorn has one horn.', [
    ['unilateral', 'done by one side only', 'The manager made a unilateral decision.'],
    ['unanimous', 'in complete agreement', 'The jury reached a unanimous verdict.'],
  ], 'Latin "one"; Greek equivalent is mono-.', ['pre-mono']),

  // ------------------------------ ROOTS ------------------------------
  P('rt-act', 'act/ag', 'to do, to drive', 'Latin', 1, 'Actors do things; agents drive action.', [
    ['agenda', 'a list of things to be done', 'The agenda listed three votes before lunch.'],
    ['enact', 'to make into law; to act out', 'Congress enacted the bill in March.'],
  ], 'Agitate, react, and transaction all drive from this root.'),

  P('rt-anim', 'anim', 'mind, spirit, life', 'Latin', 2, 'Animals are living, spirited things.', [
    ['unanimous', 'of one mind; fully agreed', 'The vote was unanimous.'],
    ['animosity', 'strong hostility', 'Years of rivalry bred real animosity.'],
  ], 'Animosity = "spirited against" — remember the emotional charge.'),

  P('rt-arch', 'arch', 'chief, first, rule', 'Greek', 2, 'An architect is a chief builder.', [
    ['monarchy', 'rule by a single sovereign', 'The monarchy ended with the revolution.'],
    ['archaic', 'very old; out of use', 'The software is positively archaic now.'],
  ], 'Archaic keeps the "first/old" sense — a great SAT trap.'),

  P('rt-aud', 'aud', 'to hear', 'Latin', 1, 'An audience comes to hear.', [
    ['audible', 'able to be heard', 'Her whisper was barely audible.'],
    ['audacious', 'bold; daring (originally "overheard" nerve)', 'His audacious plan stunned the board.'],
  ], 'Audacious drifted to "bold" — spelling hides the root.'),

  P('rt-bell', 'bell', 'war', 'Latin', 2, 'Bellicose nations love war.', [
    ['belligerent', 'hostile; eager to fight', 'His belligerent tone shut down debate.'],
    ['rebellion', 'armed resistance to authority', 'The rebellion lasted three winters.'],
  ], 'Belligerent and bellicose are classic "war" adjectives.'),

  P('rt-bio', 'bio', 'life', 'Greek', 1, 'Biology studies life.', [
    ['biography', 'a written account of a life', 'The biography spans sixty years.'],
    ['symbiotic', 'living together in close association', 'Clownfish and anemones are symbiotic.'],
  ], 'Combines with syn- (together) in symbiosis.'),

  P('rt-brev', 'brev', 'short', 'Latin', 2, 'Abbreviate = make short.', [
    ['brevity', 'shortness of time or expression', 'Brevity is the soul of wit.'],
    ['abbreviate', 'to shorten a word or text', 'We abbreviate "avenue" as "Ave."'],
  ], 'SAT loves brevity in "concise style" questions.'),

  P('rt-ced', 'ced/cess', 'to go, to yield', 'Latin', 2, 'Proceed = go forward; recede = go back.', [
    ['precedent', 'an earlier case serving as a model', 'The ruling set a new precedent.'],
    ['incessant', 'never stopping; continuous', 'The incessant rain flooded the field.'],
  ], 'Ced/cess appear in process, access, concede, secede.'),

  P('rt-chron', 'chron', 'time', 'Greek', 1, 'A chronometer measures time.', [
    ['chronic', 'persisting for a long time', 'Chronic stress harms memory.'],
    ['anachronism', 'something out of its proper time', 'A smartphone in a medieval film is an anachronism.'],
  ], 'Anachronism = against time; synchronize = together in time.'),

  P('rt-cid', 'cid/cis', 'to cut, to kill', 'Latin', 2, 'Scissors cut; decide cuts away doubt.', [
    ['incisive', 'clear and sharply analytical', 'Her incisive question ended the debate.'],
    ['precise', 'exact; sharply defined', 'Give precise measurements, not estimates.'],
  ], 'Decide literally "cuts off" other options.'),

  P('rt-cogn', 'cogn', 'to know', 'Latin', 2, 'Recognize = know again.', [
    ['cognitive', 'relating to thinking and knowing', 'Sleep improves cognitive performance.'],
    ['incognito', 'with identity concealed', 'The author traveled incognito.'],
  ], 'Cognizant and precognition extend the "know" family.'),

  P('rt-corp', 'corp', 'body', 'Latin', 2, 'A corporation is many people in one "body".', [
    ['corporeal', 'having a physical body', 'Ghosts lack corporeal form.'],
    ['incorporate', 'to include as part of a whole', 'We incorporated her feedback.'],
  ], 'Corpulent, corpse, and corps share the body root.'),

  P('rt-cred', 'cred', 'to believe', 'Latin', 1, 'Credit = belief you will repay.', [
    ['credible', 'believable; trustworthy', 'Only one witness seemed credible.'],
    ['incredulous', 'unwilling to believe', 'She gave an incredulous stare.'],
  ], 'Credentials, creed, and credulous all rest on belief.'),

  P('rt-dict', 'dict', 'to say', 'Latin', 1, 'Dictation = saying for others to write.', [
    ['predict', 'to say before it happens', 'No model predicted the outcome.'],
    ['dictum', 'a formal, authoritative statement', 'He lived by the dictum "measure twice".'],
  ], 'Verdict, edict, and contradict all speak through dict.'),

  P('rt-duct', 'duc/duct', 'to lead', 'Latin', 1, 'A conductor leads the orchestra.', [
    ['induce', 'to lead into; to cause', 'The drug may induce drowsiness.'],
    ['deduce', 'to lead to a conclusion by logic', 'From the footprints we deduced his path.'],
  ], 'Aqueducts lead water; viaducts lead roads.'),

  P('rt-equ', 'equ', 'equal', 'Latin', 1, 'An equation makes both sides equal.', [
    ['equitable', 'fair and impartial', 'They reached an equitable settlement.'],
    ['equivocal', 'deliberately unclear; ambiguous', 'His equivocal reply fooled no one.'],
  ], 'Equivocate = "equal voice" both ways — hedging.'),

  P('rt-fac', 'fac/fect/fic', 'to make, to do', 'Latin', 1, 'A factory makes things.', [
    ['facilitate', 'to make easier', 'Good tools facilitate learning.'],
    ['deficient', 'lacking; not made complete', 'The soil is deficient in nitrogen.'],
  ], 'The busiest Latin root: fact, effect, efficient, manufacture.'),

  P('rt-fer', 'fer', 'to carry, to bear', 'Latin', 2, 'A ferry carries people across.', [
    ['conifer', 'a cone-bearing tree', 'Pines and spruces are conifers.'],
    ['fertile', 'able to bear crops or young', 'The valley soil is remarkably fertile.'],
  ], 'Transfer, refer, and infer all "carry" meaning.'),

  P('rt-fid', 'fid', 'faith, trust', 'Latin', 2, 'Fidelity = faithfulness.', [
    ['confide', 'to tell in trust', 'She confided in her sister.'],
    ['perfidy', 'a breach of trust; treachery', 'The spy’s perfidy shocked the agency.'],
  ], 'Confidence and diffident (lacking self-trust) share fid.'),

  P('rt-fin', 'fin', 'end, limit', 'Latin', 1, 'Finish = bring to an end.', [
    ['finite', 'having limits; not endless', 'Resources on Earth are finite.'],
    ['indefinite', 'not clearly limited or defined', 'The meeting was postponed indefinitely.'],
  ], 'Define = set the ends/limits of a word.'),

  P('rt-flect', 'flect/flex', 'to bend', 'Latin', 2, 'Flexible = able to bend.', [
    ['reflect', 'to bend back light or thought', 'The lake reflects the mountains.'],
    ['inflection', 'a bend in voice or word form', 'Her rising inflection signaled a question.'],
  ], 'Deflect, genuflect, reflex — all bending.'),

  P('rt-flu', 'flu', 'to flow', 'Latin', 2, 'Fluids flow.', [
    ['fluent', 'flowing smoothly in speech', 'She is fluent in three languages.'],
    ['superfluity', 'an overflowing excess', 'A superfluity of options paralyzed buyers.'],
  ], 'Influence flows in; effluent flows out.'),

  P('rt-fort', 'fort', 'strong', 'Latin', 1, 'A fort is a strong building.', [
    ['fortitude', 'courage in pain or adversity', 'She bore the loss with fortitude.'],
    ['fortify', 'to strengthen against attack', 'They fortified the levees before the storm.'],
  ], 'Effort literally means "out of strength".'),

  P('rt-fract', 'fract/frag', 'to break', 'Latin', 1, 'A fracture is a break.', [
    ['fragment', 'a small broken-off piece', 'Fragments of the vase survived.'],
    ['fractious', 'irritable; likely to break into quarrels', 'The fractious coalition collapsed.'],
  ], 'Fragile, fraction, and refract share the break.'),

  P('rt-gen', 'gen', 'birth, kind, origin', 'Greek/Latin', 1, 'Genes carry your origins.', [
    ['genesis', 'the origin or birth of something', 'The book traces the genesis of jazz.'],
    ['indigenous', 'born in a place; native', 'Indigenous plants resist the drought.'],
  ], 'Generate, genre, generous, genetic — one family.'),

  P('rt-grad', 'grad/gress', 'to step, to go', 'Latin', 2, 'Graduate = step to a new level.', [
    ['gradual', 'happening by small steps', 'The gradual warming worried scientists.'],
    ['digress', 'to step away from the subject', 'Forgive me if I digress for a moment.'],
  ], 'Progress, regress, aggressive, congress — stepping everywhere.'),

  P('rt-graph', 'graph', 'to write', 'Greek', 1, 'A photograph is written with light.', [
    ['epigraph', 'a quotation at a book’s start', 'The epigraph is from Rilke.'],
    ['graphic', 'vividly descriptive; visual', 'The report gave graphic detail.'],
  ], 'Autograph, bibliography, cartography — all writing.'),

  P('rt-jur', 'jur/jus', 'law, right', 'Latin', 2, 'A jury decides by law.', [
    ['jurisdiction', 'official power over an area', 'The case fell outside federal jurisdiction.'],
    ['justify', 'to show to be right', 'How do you justify the expense?'],
  ], 'Justice, perjury, jurisprudence — the law family.'),

  P('rt-leg', 'leg/lect/lig', 'to choose, to read', 'Latin', 2, 'Select = choose apart.', [
    ['eligible', 'qualified to be chosen', 'Only members are eligible to vote.'],
    ['intellect', 'the power of knowing and reasoning', 'Her intellect impressed the panel.'],
  ], 'Elegant originally meant "carefully chosen".'),

  P('rt-log', 'log', 'word, reason, study', 'Greek', 1, 'Logic = reasoning with words.', [
    ['eloquent', 'fluent and persuasive in speech', 'Her eloquent plea swayed the jury.'],
    ['analogy', 'a comparison of like features', 'He explained waves by analogy with ropes.'],
  ], 'Dialogue, prologue, monologue — word play.'),

  P('rt-loqu', 'loqu/locut', 'to speak', 'Latin', 3, 'Loquacious people speak a lot.', [
    ['loquacious', 'very talkative', 'The loquacious host filled every silence.'],
    ['elocution', 'the art of clear public speaking', 'She studied elocution for the stage.'],
  ], 'Circumlocution = speaking around the point.'),

  P('rt-luc', 'luc/lum', 'light', 'Latin', 2, 'Lucid thinking is lit up.', [
    ['elucidate', 'to make clear; to shed light on', 'The footnotes elucidate obscure terms.'],
    ['luminous', 'giving off light; glowing', 'Luminous paint marked the exits.'],
  ], 'Translucent lets light pass through.'),

  P('rt-magn', 'magn', 'great, large', 'Latin', 1, 'Magnify = make larger.', [
    ['magnanimous', 'generously forgiving; great-souled', 'She was magnanimous in victory.'],
    ['magnitude', 'great size or importance', 'No one grasped the magnitude of the crisis.'],
  ], 'Magnanimous = great + spirit (anim).'),

  P('rt-man', 'man/manu', 'hand', 'Latin', 1, 'Manual work is done by hand.', [
    ['manipulate', 'to handle skillfully or unfairly', 'He manipulated the data to fit the theory.'],
    ['manuscript', 'a handwritten or draft text', 'The manuscript runs 400 pages.'],
  ], 'Manufacture, maneuver, emancipate — hand work.'),

  P('rt-mem', 'mem', 'to remember', 'Latin', 2, 'Memory keeps what we remember.', [
    ['memorable', 'worth remembering', 'It was a memorable performance.'],
    ['commemorate', 'to honor the memory of', 'The statue commemorates the fallen.'],
  ], 'Memento and memorandum keep the reminder sense.'),

  P('rt-meter', 'meter/metr', 'to measure', 'Greek', 1, 'A thermometer measures heat.', [
    ['symmetry', 'balanced measure on both sides', 'The facade has perfect symmetry.'],
    ['perimeter', 'the measure around a figure', 'Guards patrolled the perimeter.'],
  ], 'Geometry = earth-measure.'),

  P('rt-mit', 'mit/miss', 'to send', 'Latin', 2, 'A mission is a sending.', [
    ['transmit', 'to send across', 'The tower transmits the signal.'],
    ['remiss', 'negligent; failing a duty', 'I would be remiss not to warn you.'],
  ], 'Spelling hides the family: admit, permit, dismiss, promise.'),

  P('rt-mob', 'mob/mot', 'to move', 'Latin', 1, 'Mobile phones move with you.', [
    ['momentum', 'the force of movement', 'The campaign gained momentum.'],
    ['commotion', 'a noisy disturbance; mass movement', 'A commotion erupted in the lobby.'],
  ], 'Emotion is literally a "moving out" of feeling.'),

  P('rt-morph', 'morph', 'shape, form', 'Greek', 2, 'Metamorphosis = change of shape.', [
    ['amorphous', 'shapeless; without clear form', 'An amorphous blob drifted in the tank.'],
    ['morphology', 'the study of forms', 'Word morphology reveals their origins.'],
  ], 'Morphemes are the smallest meaning-shapes in language.'),

  P('rt-mort', 'mort', 'death', 'Latin', 2, 'Mortality = the state of being subject to death.', [
    ['mortality', 'the state of being mortal; death rate', 'The novel meditates on mortality.'],
    ['immortalize', 'to make famous forever', 'The portrait immortalized the queen.'],
  ], 'Mortician and postmortem keep the death sense.'),

  P('rt-nat', 'nat', 'born', 'Latin', 2, 'A native is born in a place.', [
    ['innate', 'present from birth; inborn', 'Some skills seem innate.'],
    ['nascent', 'just born; beginning to develop', 'The nascent industry attracted investors.'],
  ], 'Nascent and renaissance (rebirth) are SAT favorites.'),

  P('rt-nov', 'nov', 'new', 'Latin', 1, 'A novel was once a "new" story.', [
    ['novelty', 'the quality of being new', 'The novelty soon wore off.'],
    ['innovate', 'to introduce something new', 'Startups innovate faster than giants.'],
  ], 'Renovate, novice, Nova — all new.'),

  P('rt-pac', 'pac', 'peace', 'Latin', 2, 'Pacifists love peace.', [
    ['pacify', 'to calm; to bring peace', 'She pacified the crying toddler.'],
    ['appease', 'to soothe by concessions', 'Nothing could appease the angry crowd.'],
  ], 'Pacific = peace-making ocean.'),

  P('rt-path', 'path', 'feeling, suffering', 'Greek', 2, 'Empathy = feeling into another.', [
    ['apathy', 'lack of feeling or interest', 'Voter apathy worried the organizers.'],
    ['pathetic', 'arousing pity; miserably inadequate', 'A pathetic excuse fooled no one.'],
  ], 'Pathos, sympathy, antipathy — the feeling family.'),

  P('rt-ped', 'ped', 'foot', 'Latin', 2, 'Pedals are pushed by feet.', [
    ['pedestrian', 'ordinary; walking (dull)', 'The plot felt disappointingly pedestrian.'],
    ['expedite', 'to free the feet; to speed up', 'We expedited the shipping.'],
  ], 'Impede literally puts chains on feet.'),

  P('rt-pel', 'pel/puls', 'to push, to drive', 'Latin', 2, 'Propel = push forward.', [
    ['compel', 'to force; to drive together', 'Evidence compelled a verdict.'],
    ['repulsive', 'driving back; disgusting', 'The odor was repulsive.'],
  ], 'Impulse, expel, dispel — pushes in every direction.'),

  P('rt-phon', 'phon', 'sound', 'Greek', 1, 'A telephone carries sound far.', [
    ['cacophony', 'a harsh mixture of sounds', 'The cafeteria was a cacophony at noon.'],
    ['euphonious', 'pleasing to the ear', 'Her euphonious voice calmed the room.'],
  ], 'Cacophony pairs caco- (bad) with phon.'),

  P('rt-photo', 'photo', 'light', 'Greek', 1, 'Photography writes with light.', [
    ['photosynthesis', 'making food with light', 'Plants rely on photosynthesis.'],
    ['photogenic', 'looking good in light/images', 'The photogenic mayor loved cameras.'],
  ], 'Photons are particles of light.'),

  P('rt-plac', 'plac', 'to please, to calm', 'Latin', 2, 'A placid lake is calm and pleasing.', [
    ['placate', 'to calm by satisfying demands', 'They placated the critics with a refund.'],
    ['implacable', 'impossible to calm or satisfy', 'Her implacable focus unnerved rivals.'],
  ], 'Complacent = over-pleased with oneself.'),

  P('rt-port', 'port', 'to carry', 'Latin', 1, 'Porters carry luggage.', [
    ['portable', 'able to be carried', 'A portable charger saved the trip.'],
    ['deportment', 'the way one carries oneself', 'Her deportment impressed the judges.'],
  ], 'Import, export, transport, support — carrying everywhere.'),

  P('rt-pos', 'pos/pon', 'to place, to put', 'Latin', 1, 'Position = where something is placed.', [
    ['postpone', 'to place after; to delay', 'Rain postponed the final.'],
    ['impose', 'to place upon; to force', 'Don’t impose on their hospitality.'],
  ], 'Deposit, compose, expose, propose — placing it all.'),

  P('rt-pot', 'pot', 'power', 'Latin', 2, 'Potent = powerful.', [
    ['impotent', 'powerless; ineffective', 'The committee proved impotent.'],
    ['potentate', 'a powerful ruler', 'The potentate ruled for forty years.'],
  ], 'Potential is stored power not yet used.'),

  P('rt-prim', 'prim', 'first', 'Latin', 1, 'Primary = first in order.', [
    ['primal', 'first; most basic', 'Fear of darkness feels primal.'],
    ['primordial', 'existing from the beginning', 'Primordial oceans birthed early life.'],
  ], 'Prime, primitive, pristine — all "first" flavored.'),

  P('rt-punct', 'punct', 'point, to prick', 'Latin', 2, 'Punctuation marks points.', [
    ['punctilious', 'attentive to fine points', 'A punctilious editor caught every comma.'],
    ['pungent', 'sharply affecting senses (pricking)', 'The pungent cheese filled the kitchen.'],
  ], 'Punctual people arrive on the point of time.'),

  P('rt-quer', 'quer/quis', 'to ask, to seek', 'Latin', 2, 'A question asks.', [
    ['inquiry', 'an act of asking or investigating', 'The inquiry lasted six months.'],
    ['inquisitive', 'eager to ask and learn', 'Inquisitive students thrive here.'],
  ], 'Query, acquire, exquisite — seekers all.'),

  P('rt-rect', 'rect', 'straight, right', 'Latin', 2, 'A rectangle has straight sides.', [
    ['rectify', 'to make right; to correct', 'We must rectify the error.'],
    ['rectitude', 'moral straightness', 'She acted with quiet rectitude.'],
  ], 'Direct, correct, erect — standing straight.'),

  P('rt-rupt', 'rupt', 'to break', 'Latin', 2, 'A rupture is a violent break.', [
    ['disrupt', 'to break apart the flow of', 'Strikes disrupted rail service.'],
    ['abrupt', 'broken off suddenly', 'His abrupt exit ended the meeting.'],
  ], 'Bankrupt, corrupt, erupt, interrupt — breaking everywhere.'),

  P('rt-sci', 'sci', 'to know', 'Latin', 1, 'Science is organized knowing.', [
    ['omniscient', 'all-knowing', 'The omniscient narrator sees everything.'],
    ['conscience', 'inner knowledge of right and wrong', 'His conscience kept him honest.'],
  ], 'Conscious = knowing with others/self.'),

  P('rt-scrib', 'scrib/script', 'to write', 'Latin', 1, 'Scribes write by hand.', [
    ['inscribe', 'to write or carve on a surface', 'Names are inscribed on the monument.'],
    ['proscribe', 'to forbid in writing; to ban', 'The code proscribes plagiarism.'],
  ], 'Spelling shifts hide the root: describe, prescription.'),

  P('rt-sent', 'sent/sens', 'to feel', 'Latin', 1, 'Senses feel the world.', [
    ['consensus', 'a shared feeling; agreement', 'Consensus emerged after debate.'],
    ['insensible', 'without feeling; unaware', 'He seemed insensible to the cold.'],
  ], 'Sentiment, assent, dissent — feelings for and against.'),

  P('rt-sequ', 'sequ/sec', 'to follow', 'Latin', 2, 'A sequence follows in order.', [
    ['subsequent', 'following in time', 'Subsequent tests confirmed the result.'],
    ['obsequious', 'following too eagerly; fawning', 'The obsequious aide praised every idea.'],
  ], 'Sequel, consecutive, persecute — following on.'),

  P('rt-somn', 'somn', 'sleep', 'Latin', 3, 'Insomnia = not able to sleep.', [
    ['somnolent', 'drowsy; sleep-inducing', 'The somnolent lecture emptied the hall.'],
    ['somnambulist', 'a sleepwalker', 'The somnambulist wandered the halls.'],
  ], 'Somnolent is a lovely low-frequency SAT adjective.'),

  P('rt-son', 'son', 'sound', 'Latin', 1, 'A sonata is sounded, not sung.', [
    ['resonant', 'deep, full, echoing sound', 'His resonant baritone filled the hall.'],
    ['dissonant', 'harsh; lacking harmony in sound', 'The dissonant chords unsettled listeners.'],
  ], 'Latin cousin of Greek phon.'),

  P('rt-spec', 'spec/spic', 'to look, to see', 'Latin', 1, 'Spectacles help you see.', [
    ['perspicacious', 'seeing through; shrewd', 'Her perspicacious comments impressed us.'],
    ['conspicuous', 'easily seen; obvious', 'He was conspicuous by his absence.'],
  ], 'Inspect, respect (look back at), suspect — all seeing.'),

  P('rt-sta', 'sta/stat', 'to stand', 'Latin', 1, 'A statue stands still.', [
    ['stagnant', 'standing still; not flowing', 'Stagnant water bred mosquitoes.'],
    ['steadfast', 'standing firm; loyal', 'She remained steadfast under pressure.'],
  ], 'Status, obstacle, establish — standing points.'),

  P('rt-struct', 'struct', 'to build', 'Latin', 1, 'Construction workers build.', [
    ['infrastructure', 'underlying built framework', 'Aging infrastructure failed in the storm.'],
    ['construe', 'to build meaning; to interpret', 'Do not construe this as a threat.'],
  ], 'Instruct = build knowledge into someone.'),

  P('rt-tact', 'tact/tang', 'to touch', 'Latin', 2, 'Tactile things can be touched.', [
    ['tangible', 'touchable; real and definite', 'We need tangible results.'],
    ['tact', 'a sensitive touch in dealing with people', 'She handled the complaint with tact.'],
  ], 'Contact, intact, contiguous — touching or untouched.'),

  P('rt-ten', 'ten/tin', 'to hold', 'Latin', 2, 'A container holds things.', [
    ['tenacious', 'holding on firmly; persistent', 'Her tenacious research paid off.'],
    ['retain', 'to hold back; to keep', 'The soil retains moisture.'],
  ], 'Tenet, tenure, sustain — holders all.'),

  P('rt-terr', 'terr', 'earth, land', 'Latin', 1, 'Territory is land.', [
    ['terrestrial', 'of the earth; land-dwelling', 'Terrestrial planets have surfaces.'],
    ['subterranean', 'beneath the earth', 'A subterranean river feeds the wells.'],
  ], 'Terraform, terrace, Mediterranean — earth words.'),

  P('rt-tract', 'tract', 'to pull', 'Latin', 1, 'A tractor pulls.', [
    ['extract', 'to pull out', 'Dentists extract teeth.'],
    ['distract', 'to pull attention away', 'Notifications distract students.'],
  ], 'Contract, retract, protract — pulling in all directions.'),

  P('rt-vac', 'vac', 'empty', 'Latin', 2, 'A vacuum is empty space.', [
    ['vacuous', 'empty of ideas; stupid', 'The vacuous sequel said nothing.'],
    ['evacuate', 'to empty out of people', 'Residents evacuated before the flood.'],
  ], 'Vacant and vacation (emptying of work) share the root.'),

  P('rt-ven', 'ven/vent', 'to come', 'Latin', 1, 'Advent = coming toward.', [
    ['convene', 'to come together', 'The council will convene Thursday.'],
    ['intervene', 'to come between', 'Mediators intervened in the dispute.'],
  ], 'Prevent = come before; revenue = what comes back.'),

  P('rt-ver', 'ver', 'true', 'Latin', 2, 'Verify = make true/check truth.', [
    ['veracity', 'truthfulness; accuracy', 'No one questioned the report’s veracity.'],
    ['aver', 'to assert as true', 'She averred her innocence.'],
  ], 'Verdict = truly said.'),

  P('rt-verb', 'verb', 'word', 'Latin', 2, 'Verbal = of words.', [
    ['verbose', 'using too many words', 'The verbose memo buried its point.'],
    ['proverb', 'a short saying of wisdom', '"Haste makes waste" is a proverb.'],
  ], 'Verbatim = word for word.'),

  P('rt-vert', 'vert/vers', 'to turn', 'Latin', 1, 'Reverse = turn back.', [
    ['avert', 'to turn away', 'Quick action averted disaster.'],
    ['versatile', 'turning easily to many tasks', 'A versatile tool belongs in every kit.'],
  ], 'Introvert/extrovert turn inward and outward.'),

  P('rt-vid', 'vid/vis', 'to see', 'Latin', 1, 'Video = I see.', [
    ['evident', 'easily seen; obvious', 'Her relief was evident.'],
    ['envision', 'to see in the mind', 'We envision a greener campus.'],
  ], 'Vision, revise (see again), supervise — all seeing.'),

  P('rt-viv', 'viv/vit', 'to live', 'Latin', 1, 'Vivid = full of life.', [
    ['revitalize', 'to bring back to life', 'The grant revitalized the theater.'],
    ['vital', 'essential to life; crucial', 'Sleep is vital to memory.'],
  ], 'Survive = live beyond.'),

  P('rt-voc', 'voc/vok', 'to call; voice', 'Latin', 1, 'Vocal = of the voice.', [
    ['invoke', 'to call upon', 'He invoked the Fifth Amendment.'],
    ['vocation', 'a calling; an occupation', 'Teaching was her true vocation.'],
  ], 'Advocate, provoke, revoke — calling in every direction.'),

  P('rt-vol', 'vol', 'to wish, will', 'Latin', 2, 'Volunteers act by their own will.', [
    ['benevolence', 'the wish to do good', 'Her benevolence funded the clinic.'],
    ['volition', 'the power of willing', 'He left of his own volition.'],
  ], 'Malevolent = wishing evil; involuntary = against will.', ['pre-bene', 'pre-mal']),

  // ------------------------------ SUFFIXES ------------------------------
  P('suf-able', '-able/-ible', 'able to be', 'Latin', 1, 'A washable shirt can be washed.', [
    ['plausible', 'able to be believed; credible', 'Her story seemed plausible.'],
    ['indefatigable', 'unable to be tired out', 'The indefatigable nurse worked double shifts.'],
  ], 'Plausible, viable, feasible — a top SAT suffix family.'),

  P('suf-al', '-al', 'relating to; characterized by', 'Latin', 1, 'Musical relates to music.', [
    ['ephemeral', 'relating to a single day; fleeting', 'Ephemeral blooms fade by dusk.'],
    ['trivial', 'relating to trifles; unimportant', 'Do not waste time on trivial errors.'],
  ], 'Turns nouns into adjectives: nature → natural.'),

  P('suf-ance', '-ance/-ence', 'state, quality, or action', 'Latin', 1, 'Performance is the act of performing.', [
    ['eloquence', 'the quality of fluent, powerful speech', 'Her eloquence silenced the critics.'],
    ['prudence', 'the quality of careful judgment', 'Prudence counseled waiting.'],
  ], 'Eloquence, prudence, decadence — noun-forming power.'),

  P('suf-ant', '-ant/-ent', 'one who; inclined to', 'Latin', 2, 'A servant is one who serves.', [
    ['dormant', 'in a state of rest; inactive', 'The dormant volcano loomed over the town.'],
    ['fervent', 'inclined to burning passion', 'He is a fervent supporter of the arts.'],
  ], 'Adjective or noun: defiant (adj.), participant (n.).'),

  P('suf-ary', '-ary', 'relating to; place for', 'Latin', 2, 'A library is a place for books (liber).', [
    ['exemplary', 'relating to an example; model', 'Her exemplary record earned promotion.'],
    ['arbitrary', 'relating to whim, not reason', 'The rules seemed arbitrary and unfair.'],
  ], 'Arbitrary is a must-know SAT adjective.'),

  P('suf-ate', '-ate', 'to make; to act upon', 'Latin', 1, 'Activate = make active.', [
    ['alleviate', 'to make lighter; to relieve', 'The medicine alleviated the pain.'],
    ['exacerbate', 'to make worse', 'Delays exacerbated the shortage.'],
  ], 'Exacerbate vs alleviate — the classic opposite pair.'),

  P('suf-dom', '-dom', 'state, rank, or realm', 'Old English', 2, 'A kingdom is a king’s realm.', [
    ['boredom', 'the state of being bored', 'Boredom bred creativity in the workshop.'],
    ['martyrdom', 'the state of being a martyr', 'The play dramatizes her martyrdom.'],
  ], 'Freedom and wisdom use the same native suffix.'),

  P('suf-er', '-er/-or', 'one who does', 'Latin/OE', 1, 'A teacher is one who teaches.', [
    ['orator', 'one who delivers speeches', 'The orator held the crowd spellbound.'],
    ['arbiter', 'one who judges or decides', 'The editor became arbiter of style.'],
  ], 'Arbiter, curator, narrator — "one who" nouns.'),

  P('suf-esque', '-esque', 'in the style of', 'French/Italian', 3, 'Picturesque = like a picture.', [
    ['picturesque', 'visually charming, like a picture', 'The picturesque village drew painters.'],
    ['Kafkaesque', 'in the surreal style of Kafka', 'The Kafkaesque bureaucracy trapped him.'],
  ], 'Used to coin stylish adjectives from proper names.'),

  P('suf-ful', '-ful', 'full of', 'Old English', 1, 'Hopeful = full of hope.', [
    ['bountiful', 'full of bounty; abundant', 'The harvest was bountiful.'],
    ['doleful', 'full of sorrow', 'The doleful melody silenced the room.'],
  ], 'Remember: only one l — hopeful, not hopefull.'),

  P('suf-fy', '-fy/-ify', 'to make or become', 'Latin', 1, 'Simplify = make simple.', [
    ['clarify', 'to make clear', 'Could you clarify the second point?'],
    ['falsify', 'to make false; to misrepresent', 'Scientists must never falsify data.'],
  ], 'Verify, justify, rectify — all "making".'),

  P('suf-hood', '-hood', 'state or condition of being', 'Old English', 2, 'Childhood is the state of being a child.', [
    ['likelihood', 'the state of being likely', 'There is little likelihood of rain.'],
    ['brotherhood', 'the state of being brothers', 'The brotherhood of firefighters is strong.'],
  ], 'A native suffix next to Latin -ity and -ness.'),

  P('suf-ic', '-ic', 'relating to; having the nature of', 'Greek/Latin', 1, 'Heroic = having the nature of a hero.', [
    ['cryptic', 'having a hidden nature; mysterious', 'She left a cryptic note.'],
    ['dogmatic', 'inclined to assert opinions as fact', 'His dogmatic tone alienated allies.'],
  ], 'Cryptic, caustic, dogmatic — SAT adjective factory.'),

  P('suf-ile', '-ile', 'capable of; relating to', 'Latin', 2, 'Fragile = easily able to be broken.', [
    ['docile', 'easily taught or led; compliant', 'The docile pony was perfect for children.'],
    ['futile', 'incapable of producing results', 'Arguing further was futile.'],
  ], 'Docile, futile, versatile, hostile — high-value set.'),

  P('suf-ion', '-ion/-tion', 'act, state, or result', 'Latin', 1, 'Action = the act of acting.', [
    ['abdication', 'the act of formally giving up power', 'The king’s abdication stunned the court.'],
    ['attrition', 'the gradual reduction by friction or loss', 'Attrition shrank the workforce over years.'],
    ['revelation', 'the act of revealing; a disclosure', 'The revelation stunned the press corps.'],
  ], 'The most common noun suffix in academic prose.'),

  P('suf-ish', '-ish', 'somewhat; like', 'Old English', 1, 'Reddish = somewhat red.', [
    ['impish', 'like an imp; mischievous', 'An impish grin crossed her face.'],
    ['amateurish', 'like an amateur; unskilled', 'The amateurish edit ruined the scene.'],
  ], 'Adds approximation: fiftyish, smallish.'),

  P('suf-ism', '-ism', 'doctrine, practice, or condition', 'Greek', 1, 'Optimism = the practice of expecting good.', [
    ['pragmatism', 'a practical rather than ideal approach', 'Her pragmatism steadied the team.'],
    ['skepticism', 'the practice of doubting claims', 'Healthy skepticism protects consumers.'],
  ], 'Pragmatism and skepticism headline SAT passages.'),

  P('suf-ist', '-ist', 'one who practices or believes', 'Greek', 1, 'A pianist practices piano.', [
    ['protagonist', 'the leading character (first struggler)', 'The protagonist faces a moral dilemma.'],
    ['satirist', 'one who practices satire', 'The satirist skewered corrupt officials.'],
  ], 'Protagonist vs antagonist — the SAT Reading pair.'),

  P('suf-ity', '-ity/-ty', 'quality or state', 'Latin', 1, 'Clarity = the quality of being clear.', [
    ['ambiguity', 'the state of being open to interpretations', 'The ambiguity of the clause caused lawsuits.'],
    ['scarcity', 'the state of being scarce', 'Scarcity drove prices higher.'],
  ], 'Ambiguity, brevity, scarcity — abstract-noun machine.'),

  P('suf-ive', '-ive', 'having the nature of', 'Latin', 1, 'Active = having the nature of acting.', [
    ['evasive', 'having the nature of avoiding', 'The witness gave evasive answers.'],
    ['lucrative', 'having the nature of profit', 'She found a lucrative niche.'],
  ], 'Evasive, lucrative, reclusive, coercive.'),

  P('suf-ize', '-ize', 'to make or become', 'Greek', 1, 'Modernize = make modern.', [
    ['galvanize', 'to shock into action', 'The verdict galvanized the movement.'],
    ['scrutinize', 'to examine closely', 'Auditors scrutinize every ledger.'],
  ], 'Scrutinize, galvanize, satirize — action verbs.'),

  P('suf-less', '-less', 'without', 'Old English', 1, 'Hopeless = without hope.', [
    ['dauntless', 'without fear; fearless', 'The dauntless crew sailed into the storm.'],
    ['feckless', 'without effect; irresponsible', 'The feckless plan ignored the budget.'],
  ], 'Dauntless and feckless are great tone words.'),

  P('suf-logy', '-logy', 'study or science of', 'Greek', 1, 'Biology = the study of life.', [
    ['anthropology', 'the study of humans', 'She majors in anthropology.'],
    ['terminology', 'the set of terms in a field', 'Legal terminology confuses clients.'],
  ], 'Combines with roots: geo-logy, psycho-logy.'),

  P('suf-ly', '-ly', 'in the manner of', 'Old English', 1, 'Slowly = in a slow manner.', [
    ['ostensibly', 'apparently; on the surface', 'He ostensibly left for health reasons.'],
    ['invariably', 'without exception; always', 'The trains are invariably late.'],
  ], 'Ostensibly and invariably anchor SAT argument tone.'),

  P('suf-ment', '-ment', 'result or means of an action', 'Latin', 1, 'Movement = the result of moving.', [
    ['entanglement', 'the state of being tangled in', 'The legal entanglement lasted years.'],
    ['instrument', 'a means by which something is done', 'The treaty became an instrument of peace.'],
  ], 'Fragment, ornament, temperament — Latin noun endings.'),

  P('suf-ness', '-ness', 'state or quality', 'Old English', 1, 'Darkness = the state of being dark.', [
    ['aloofness', 'the state of being distant or cool', 'Her aloofness was mistaken for pride.'],
    ['willingness', 'the state of being ready to act', 'Her willingness to listen won trust.'],
  ], 'A native suffix that attaches to any adjective.'),

  P('suf-ous', '-ous', 'full of; characterized by', 'Latin', 1, 'Joyous = full of joy.', [
    ['onerous', 'full of burden; oppressive', 'The onerous contract trapped tenants.'],
    ['fastidious', 'full of careful attention; picky', 'A fastidious chef weighs every gram.'],
  ], 'Onerous, fastidious, meticulous — SAT staples.'),

  P('suf-ship', '-ship', 'state, skill, or office', 'Old English', 2, 'Friendship = the state of being friends.', [
    ['craftsmanship', 'the skill of a craftsperson', 'The craftsmanship impressed the judges.'],
    ['hardship', 'a state of severe difficulty', 'They endured great hardship together.'],
  ], 'Leadership, scholarship, kinship.'),

  P('suf-tude', '-tude', 'state or condition', 'Latin', 2, 'Gratitude = the state of being grateful.', [
    ['lassitude', 'a state of weariness', 'A wave of lassitude followed the fever.'],
    ['aptitude', 'a natural state of ability', 'She shows real aptitude for languages.'],
  ], 'Aptitude, lassitude, solitude — condition nouns.'),
];
