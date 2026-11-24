import type { Post } from "./types";

/** Draft: not live until its publish date is decided. Remove `draft` to publish. */
export const buildingWithAi: Post = {
  slug: "building-with-ai-still-needs-engineering",
  publishedAt: "2026-11-13",
  author: "Hassan Azab",
  draft: true,
  text: {
    en: {
      title: "Building with AI still needs engineering",
      summary: "AI can start a project quickly. Keeping it reliable takes someone who understands how the whole system works.",
      sections: [
        {
          id: "problem",
          title: "The problem",
          blocks: [
            "In the AI era, starting a project is easier than ever. AI can help with the design, backend, and application logic. But when it gets something wrong, starting over or spending more tokens can leave the real problem untouched.",
          ],
        },
        {
          id: "fix",
          title: "How I approach the fix",
          blocks: [
            "An AI subscription is a useful tool, but it cannot replace someone who understands the system. A reliable product needs a person who can trace failures, fix bugs and fallback paths, close security gaps, and maintain it after delivery.",
          ],
        },
        {
          id: "starting-over",
          title: "What I would do from the start",
          blocks: [
            "If I were starting over, I would plan for debugging, fallback paths, security, and maintenance from the first day—not only for delivery. That is the kind of development partnership I offer businesses. If you have a project or a question, I would be glad to hear from you.",
          ],
        },
      ],
    },
    de: {
      title: "Auch mit KI braucht gute Software Engineering",
      summary: "KI kann ein Projekt schnell starten. Für zuverlässige Software braucht es jemanden, der das ganze System versteht.",
      sections: [
        {
          id: "problem",
          title: "Das Problem",
          blocks: [
            "Im KI-Zeitalter ist der Start eines Projekts einfacher denn je. KI kann beim Design, Backend und der Anwendungslogik helfen. Wenn sie jedoch einen Fehler macht, lösen ein Neustart oder noch mehr Tokens das eigentliche Problem oft nicht.",
          ],
        },
        {
          id: "fix",
          title: "So gehe ich die Lösung an",
          blocks: [
            "Ein KI-Abonnement ist ein nützliches Werkzeug, ersetzt aber niemanden, der das System versteht. Ein zuverlässiges Produkt braucht jemanden, der Fehler aufspürt, Bugs und Ausweichpfade korrigiert, Sicherheitslücken schließt und die Software nach der Auslieferung wartet.",
          ],
        },
        {
          id: "starting-over",
          title: "Was ich von Anfang an tun würde",
          blocks: [
            "Wenn ich von vorn anfangen würde, würde ich Debugging, Ausweichpfade, Sicherheit und Wartung von Anfang an einplanen – nicht nur die Auslieferung. So begleite ich Unternehmen als Entwicklungspartner. Wenn Sie ein Projekt oder eine Frage haben, freue ich mich auf Ihre Nachricht.",
          ],
        },
      ],
    },
    fr: {
      title: "Créer avec l'IA demande toujours de l'ingénierie",
      summary: "L'IA permet de démarrer vite. Pour rendre un produit fiable, il faut quelqu'un qui comprend tout le système.",
      sections: [
        {
          id: "problem",
          title: "Le problème",
          blocks: [
            "À l'ère de l'IA, démarrer un projet est plus facile que jamais. L'IA peut aider à créer le design, le backend et la logique de l'application. Mais quand elle se trompe, repartir de zéro ou dépenser davantage de jetons ne résout pas forcément le vrai problème.",
          ],
        },
        {
          id: "fix",
          title: "Comment j'aborde la solution",
          blocks: [
            "Un abonnement à l'IA est un outil utile, mais il ne remplace pas une personne qui comprend le système. Un produit fiable demande quelqu'un capable de trouver les causes des pannes, de corriger les bugs et les solutions de repli, de combler les failles de sécurité et d'assurer la maintenance après la livraison.",
          ],
        },
        {
          id: "starting-over",
          title: "Ce que je ferais dès le départ",
          blocks: [
            "Si je repartais de zéro, je prévoirais dès le premier jour le débogage, les solutions de repli, la sécurité et la maintenance, pas seulement la livraison. C'est l'accompagnement que je propose aux entreprises comme partenaire de développement. Si vous avez un projet ou une question, écrivez-moi.",
          ],
        },
      ],
    },
    ar: {
      title: "البناء بالذكاء الاصطناعي ما زال يحتاج إلى هندسة",
      summary: "يمكن للذكاء الاصطناعي أن يبدأ المشروع بسرعة، لكن موثوقيته تحتاج إلى من يفهم النظام كله.",
      sections: [
        {
          id: "problem",
          title: "المشكلة",
          blocks: [
            "في عصر الذكاء الاصطناعي، أصبحت بداية المشروع أسهل من أي وقت مضى. يمكن للذكاء الاصطناعي المساعدة في التصميم والواجهة الخلفية ومنطق التطبيق. لكن عندما يخطئ، قد لا تحل إعادة البدء أو استهلاك المزيد من الرموز المشكلة الحقيقية.",
          ],
        },
        {
          id: "fix",
          title: "كيف أتعامل مع الإصلاح",
          blocks: [
            "الاشتراك في أدوات الذكاء الاصطناعي مفيد، لكنه لا يغني عن شخص يفهم النظام. المنتج الموثوق يحتاج إلى من يتتبع أسباب الأعطال، ويصلح الأخطاء ومسارات التعامل مع الفشل، ويغلق الثغرات الأمنية، ويتولى الصيانة بعد التسليم.",
          ],
        },
        {
          id: "starting-over",
          title: "ما الذي سأفعله من البداية",
          blocks: [
            "لو بدأت من جديد، لخططت من اليوم الأول للتصحيح ومسارات التعامل مع الفشل والأمان والصيانة، وليس للتسليم وحده. هذا نوع الشراكة في التطوير الذي أقدمه للشركات. إذا كان لديك مشروع أو سؤال، يسعدني التواصل معك.",
          ],
        },
      ],
    },
  },
};
