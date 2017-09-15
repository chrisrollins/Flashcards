Crystalline.init("cardList", []);
Crystalline.init("cardCount", 0);
Crystalline.bind("#card_list", "cardList");
Crystalline.format("cardList", {
	studyWord: {title: "Study Word"},
	nativeWord: {title: "Native Word"},
	score: {title: "Score"},
	id: {showTitle: false, showValue: false}
});

const Flashcards = (function()
{
	//card: { studyWord: string, nativeWord: string, id: int(auto increment), score: {idk yet} }
	function add(card)
	{
		if(typeof card.nativeWord !== "string" || typeof card.studyWord !== "string")
			{ return false; }
		card.id = Crystalline.data.cardCount++;
		card.score = {};
		Crystalline.data.cardList.push(card);
	}

	return Object.freeze({
		get list()
		{
			return [...Crystalline.get("cardList")];
		},
		get add()
		{
			return add.bind(null);
		}
	});
})();