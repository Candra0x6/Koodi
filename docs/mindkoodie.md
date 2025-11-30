Duolingo’s Adaptive Question-Selection System

Duolingo uses a sophisticated “session generator” algorithm combined with machine learning to decide which exercises (questions) to give each learner. In broad strokes, the system proceeds roughly as follows:

1. Choose content focus (skill/learning objective): Duolingo first determines what concept or vocabulary area to target next, based on the learner’s progress and the course curriculum. In practice, the lesson’s theme and grammar focus are pre-planned by the curriculum designers (for example, “present tense verbs” or a particular vocabulary set)
reddit.com
. The system knows which skill or objective a learner is on and which new words and grammar items they need to learn or review next. This is guided by Duolingo’s curriculum design (aligned to CEFR levels) and by data on the learner’s past performance. For example, a Duolingo learning scientist explains that the session generator “takes into account the number of new words, grammatical features… and which level the lesson is in” when creating a lesson
reddit.com
.

2. Select exercise types: Next, the algorithm chooses which formats of exercises to include (e.g. translate, listen-and-type, matching, multiple-choice, speaking). Duolingo offers a variety of exercise formats for each sentence, and the system ensures variety and appropriate difficulty. The session generator balances factors like difficulty level, variety, and spacing. For example, if the learner is having trouble with a concept, Duolingo may give easier exercises (e.g. more multiple-choice) and more repetition; if the learner is doing well, it may give harder formats (e.g. typing or speaking) and fewer hints
venturebeat.com
. In the words of Duolingo’s cofounder, Luis von Ahn, Birdbrain (the ML model) will calibrate so that “if you’re getting everything right, we say ‘Let’s give you something that we think you only have a 70% chance of getting right’… if you’re getting a lot wrong, we actually start giving you things that are easier”
venturebeat.com
. The session generator also considers combinations of content and format: for instance, it won’t pair a grammar drill that requires an image if the focus is on verb endings without images
reddit.com
.

3. Select content from database: Having picked the topic and exercise formats, the system then pulls actual sentences or items from its content database. Duolingo has a vast repository of sentence exercises, each tagged with difficulty level (aligned to CEFR levels like A1, A2, B1, etc.), grammatical features, and vocabulary. When generating a lesson, the system filters this pool by the current lesson’s objectives and by what vocabulary the user has unlocked. For example, it might choose sentences at the A2 level that use the target grammar tag and only include words the learner has already been introduced to. (Duolingo content creators write all the sentences manually, but the algorithm can present any sentence in multiple exercise types
reddit.com
.) In other words, the session generator assembles a candidate set of appropriate exercises – sometimes on the order of hundreds of potential challenges
venturebeat.com
 – before narrowing it down.

4. Personalize difficulty and sequencing: Finally, Duolingo personalizes the lesson to the individual learner’s current ability. The system uses data on the learner’s performance so far (such as which words and concepts they’ve mastered or struggled with) to adjust difficulty. If the learner has been getting many answers wrong, the algorithm will drop in easier items, give hints, or repeat concepts more often. If the learner is getting everything right, it will introduce harder sentences (longer or more complex) and reduce hints to keep it challenging
venturebeat.com
. Behind the scenes, every time a learner answers an exercise, Duolingo updates its estimate of that learner’s proficiency and the difficulty of the exercise (much like updating an Elo rating)
spectrum.ieee.org
. This dynamic adjustment ensures that each lesson stays in the learner’s “zone of proximal development” – not so hard as to be frustrating, nor so easy as to be boring
duolingo-papers.s3.amazonaws.com
venturebeat.com
.

Together these steps form Duolingo’s adaptive loop. As one Duolingo engineer put it, the session generator may start with ~200 candidate exercises that might fit the lesson, then use Birdbrain’s difficulty predictions to pick and order the final ~14 exercises for that lesson
venturebeat.com
. The result is that each user’s lesson is unique and tailored to their needs: “the specific exercises you are served vary, so each overall lesson… ends up being different for everyone”
venturebeat.com
.

The Birdbrain Personalization Model

The “secret sauce” behind Duolingo’s adaptation is Birdbrain, a machine-learning student model that predicts how likely a learner is to answer any given exercise correctly. Birdbrain is trained on billions of past exercise results and combines information about both the learner’s history and the content’s difficulty. In practice, for any candidate exercise it computes a probability of success for the learner
spectrum.ieee.org
. It then feeds those predictions back into the session generator. As Burr Settles of Duolingo explains: the session generator puts forward a set of possible exercises, Birdbrain returns a difficulty probability for each, and then the generator selects the best ones to include in the lesson
venturebeat.com
. This way, Birdbrain directly influences which questions to serve next and how hard they should be.

Birdbrain’s inputs include the learner’s correctness history on past items, and it continually updates its model after each exercise (originally as an online Elo-like update, now with a more complex LSTM model)
spectrum.ieee.org
venturebeat.com
. It also implicitly embodies a forgetting curve or spaced-repetition logic: Duolingo’s spaced-repetition system (dating back to 2013) predicts when a word will be forgotten and flags it for review
venturebeat.com
, and Birdbrain can push review items into lessons at optimal intervals. In short, Birdbrain combines the learner’s recent performance (correct/incorrect streaks) with global data on exercise difficulty to decide what the learner needs next.

The practical effect is highly personalized pacing. For example, if Birdbrain predicts you have a high chance of getting an easy sentence right, it will boost that sentence’s difficulty or save it for later, whereas if you’re struggling, it will lower the difficulty and possibly repeat the concept. Duolingo reports that using Birdbrain in this way (A/B tested) leads to better learning outcomes and higher engagement
blog.duolingo.com
. In sum, Duolingo’s “real secret” is that every lesson is dynamically generated: first by the session generator choosing candidate questions, then by Birdbrain scoring them and guiding the final selection so that the exercises are neither too hard nor too easy for that learner
venturebeat.com
duolingo-papers.s3.amazonaws.com
.

Sources: Duolingo’s own publications and interviews describe this process. For example, the Duolingo engineering blog and whitepaper explain that their “session generator” crafts lessons from a wide pool of exercises and uses Birdbrain’s learner-model predictions to choose appropriately difficult items
blog.duolingo.com
duolingo-papers.s3.amazonaws.com
. Industry articles and Duolingo staff interviews (e.g. in IEEE Spectrum and VentureBeat) also confirm that Birdbrain scores exercise difficulty for each user and guides the real-time selection and sequencing of practice questions
spectrum.ieee.org
venturebeat.com
. These sources corroborate the outline given above, though Duolingo’s system is continuously updated (e.g. Birdbrain v2 in 2023), and new AI tools (like generating exercises via LLMs) are being introduced as of 2023
blog.duolingo.com
duolingo-papers.s3.amazonaws.com
.