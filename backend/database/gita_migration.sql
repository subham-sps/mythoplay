-- Gita Weekly Shlokas table
CREATE TABLE IF NOT EXISTS gita_weekly_shlokas (
    id SERIAL PRIMARY KEY,
    week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 52),
    reference VARCHAR(100) NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    sanskrit TEXT NOT NULL,
    transliteration_english TEXT NOT NULL,
    meaning TEXT NOT NULL,
    insights JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(week_number)
);

CREATE INDEX IF NOT EXISTS idx_gita_week_number ON gita_weekly_shlokas(week_number);

CREATE TRIGGER update_gita_shlokas_updated_at
  BEFORE UPDATE ON gita_weekly_shlokas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed 20 well-known shlokas (weeks 1-20); weeks 21-52 cycle back via backend logic
INSERT INTO gita_weekly_shlokas (week_number, reference, chapter, verse, sanskrit, transliteration_english, meaning) VALUES

(1, 'Bhagavad Gita 2.47', 2, 47,
 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana | mā karma-phala-hetur bhūr mā te saṅgo ''stvakarmaṇi',
 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results, and never be attached to not doing your duty.'),

(2, 'Bhagavad Gita 2.13', 2, 13,
 'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा। तथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति॥',
 'dehino ''smin yathā dehe kaumāraṁ yauvanaṁ jarā | tathā dehāntara-prāptir dhīras tatra na muhyati',
 'Just as the soul passes through childhood, youth, and old age in this body, similarly it passes into another body at death. A wise person is not confused by this change.'),

(3, 'Bhagavad Gita 2.20', 2, 20,
 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥',
 'na jāyate mriyate vā kadāchin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ | ajo nityaḥ śhāśhvato ''yaṁ purāṇo na hanyate hanyamāne śharīre',
 'The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.'),

(4, 'Bhagavad Gita 2.22', 2, 22,
 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥',
 'vāsāṁsi jīrṇāni yathā vihāya navāni gṛihṇāti naro ''parāṇi | tathā śharīrāṇi vihāya jīrṇāny anyāni saṁyāti navāni dehī',
 'Just as a person puts on new garments, giving up old ones, similarly the soul accepts new material bodies, giving up the old and useless ones.'),

(5, 'Bhagavad Gita 4.7', 4, 7,
 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
 'yadā yadā hi dharmasya glānir bhavati bhārata | abhyutthānam adharmasya tadātmānaṁ sṛijāmy aham',
 'Whenever righteousness declines and unrighteousness rises, O Arjuna, at that time I manifest Myself on earth.'),

(6, 'Bhagavad Gita 4.8', 4, 8,
 'परित्राणाय साधूनां विनाशाय च दुष्कृताम्। धर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥',
 'paritrāṇāya sādhūnāṁ vināśhāya cha duṣhkṛitām | dharma-saṁsthāpanārthāya sambhavāmi yuge yuge',
 'To protect the righteous, to annihilate the wicked, and to reestablish the principles of dharma, I appear on this earth age after age.'),

(7, 'Bhagavad Gita 6.5', 6, 5,
 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
 'uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ',
 'Elevate yourself through the power of your own mind, and do not degrade yourself, for the mind can be the friend and also the enemy of the self.'),

(8, 'Bhagavad Gita 6.35', 6, 35,
 'असंशयं महाबाहो मनो दुर्निग्रहं चलम्। अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥',
 'asaṁśhayaṁ mahā-bāho mano durnigrahaṁ chalam | abhyāsena tu kaunteya vairāgyeṇa cha gṛihyate',
 'Undoubtedly, O mighty-armed Arjuna, the mind is restless and difficult to restrain. But it is controlled through regular practice and detachment.'),

(9, 'Bhagavad Gita 9.22', 9, 22,
 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
 'ananyāśh chintayanto māṁ ye janāḥ paryupāsate | teṣhāṁ nityābhiyuktānāṁ yoga-kṣhemaṁ vahāmy aham',
 'For those who worship Me with devotion, meditating on My transcendental form, I carry what they lack and preserve what they have.'),

(10, 'Bhagavad Gita 10.20', 10, 20,
 'अहमात्मा गुडाकेश सर्वभूताशयस्थितः। अहमादिश्च मध्यं च भूतानामन्त एव च॥',
 'aham ātmā guḍākeśha sarva-bhūtāśhaya-sthitaḥ | aham ādiśh cha madhyaṁ cha bhūtānām anta eva cha',
 'I am the Self, O Arjuna, seated in the hearts of all creatures. I am the beginning, the middle, and the end of all beings.'),

(11, 'Bhagavad Gita 11.33', 11, 33,
 'तस्मात्त्वमुत्तिष्ठ यशो लभस्व जित्वा शत्रून्भुंक्ष्व राज्यं समृद्धम्। मयैवैते निहताः पूर्वमेव निमित्तमात्रं भव सव्यसाचिन्॥',
 'tasmāt tvam uttiṣhṭha yaśho labhasva jitvā śhatrūn bhuṅkṣhva rājyaṁ samṛiddham | mayaivaite nihitāḥ pūrvam eva nimitta-mātraṁ bhava savyasāchin',
 'Therefore, arise and attain glory. Conquer your enemies and enjoy a prosperous kingdom. These warriors have already been destroyed by Me; you are only the instrument, O Arjuna.'),

(12, 'Bhagavad Gita 12.13', 12, 13,
 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च। निर्ममो निरहंकारः समदुःखसुखः क्षमी॥',
 'adveṣhṭā sarva-bhūtānāṁ maitraḥ karuṇa eva cha | nirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣhamī',
 'One who is not envious but is a kind friend to all living beings, who is free from false ego, and who is equal in both happiness and distress, who is tolerant and forgiving — such a devotee is very dear to Me.'),

(13, 'Bhagavad Gita 15.7', 15, 7,
 'ममैवांशो जीवलोके जीवभूतः सनातनः। मनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति॥',
 'mamaivāṁśho jīva-loke jīva-bhūtaḥ sanātanaḥ | manaḥ-ṣhaṣhṭhānīndriyāṇi prakṛiti-sthāni karṣhati',
 'The living soul in this world is an eternal fragment of My own being. But bound by material nature, it struggles with the six senses, including the mind.'),

(14, 'Bhagavad Gita 18.65', 18, 65,
 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु। मामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे॥',
 'man-manā bhava mad-bhakto mad-yājī māṁ namaskuru | mām evaiṣhyasi satyaṁ te pratijāne priyo ''si me',
 'Fix your mind on Me, be devoted to Me, worship Me, bow down to Me. You will surely come to Me. I promise you truly, for you are very dear to Me.'),

(15, 'Bhagavad Gita 18.66', 18, 66,
 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
 'sarva-dharmān parityajya mām ekaṁ śharaṇaṁ vraja | ahaṁ tvāṁ sarva-pāpebhyo mokṣhayiṣhyāmi mā śhuchaḥ',
 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions; do not fear.'),

(16, 'Bhagavad Gita 2.14', 2, 14,
 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
 'mātrā-sparśhās tu kaunteya śhītoṣhṇa-sukha-duḥkha-dāḥ | āgamāpāyino ''nityās tāṁs titikṣhasva bhārata',
 'O son of Kunti, the contact between the senses and sense objects gives rise to fleeting feelings of happiness and distress. These are temporary — they come and go like winter and summer. Endure them patiently.'),

(17, 'Bhagavad Gita 2.19', 2, 19,
 'य एनं वेत्ति हन्तारं यश्चैनं मन्यते हतम्। उभौ तौ न विजानीतो नायं हन्ति न हन्यते॥',
 'ya enaṁ vetti hantāraṁ yaśh chainaṁ manyate hatam | ubhau tau na vijānīto nāyaṁ hanti na hanyate',
 'Those who think the soul can kill and those who think it can be killed are both mistaken. For truly, the soul neither kills, nor can it be killed.'),

(18, 'Bhagavad Gita 3.21', 3, 21,
 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः। स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते॥',
 'yad yad ācharati śhreṣhṭhas tat tad evetaro janaḥ | sa yat pramāṇaṁ kurute lokas tad anuvartate',
 'Whatever actions great persons perform, common people follow. Whatever standards they set by their example, the world pursues.'),

(19, 'Bhagavad Gita 3.27', 3, 27,
 'प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः। अहंकारविमूढात्मा कर्ताहमिति मन्यते॥',
 'prakṛiteḥ kriyamāṇāni guṇaiḥ karmāṇi sarvaśhaḥ | ahaṅkāra-vimūḍhātmā kartāham iti manyate',
 'All actions are carried out by the three modes of material nature. But in ignorance, the soul, deluded by false identification with the body, thinks of itself as the doer.'),

(20, 'Bhagavad Gita 5.22', 5, 22,
 'ये हि संस्पर्शजा भोगा दुःखयोनय एव ते। आद्यन्तवन्तः कौन्तेय न तेषु रमते बुधः॥',
 'ye hi saṁsparśha-jā bhogā duḥkha-yonaya eva te | ādy-antavantaḥ kaunteya na teṣhu ramate budhaḥ',
 'The pleasures that arise from contact with the sense objects are sources of misery. They have a beginning and an end, O Arjuna. A wise person does not find happiness in them.')

ON CONFLICT (week_number) DO NOTHING;
