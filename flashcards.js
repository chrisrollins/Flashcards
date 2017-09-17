Crystalline.init("cardList", []);
Crystalline.init("cardCount", 0);
Crystalline.bind("#card_list", "cardList");
Crystalline.order("cardList", ["studyWord", "nativeWord", "remove"]);
Crystalline.format("cardList", {
	studyWord: {title: "Study Word"},
	nativeWord: {title: "Native Word"},
	score: {showTitle: false, showValue: false},
	remove: {showTitle: false, showValue: true, template: {tag: "button", className: "removeButton small_button", id: "remove_{{id}}"}},
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
		card.score = 0;
		card.remove = "Remove";
		Crystalline.data.cardList.push(card);
	}

	function remove(id)
	{
		if(typeof id === "number")
		{
			for(let i = 0; i < Crystalline.data.cardList.length; i++)
			{
				const card = Crystalline.data.cardList[i];
				if(card.id === id)
				{
					Crystalline.data.cardList.splice(i, 1);
					return;
				}
			}
		}
		else
		{
			console.error("Expected a number.");
		}
	}

	return Object.freeze({
		get list()
		{
			return [...Crystalline.get("cardList")];
		},
		get add()
		{
			return add.bind(null);
		},
		get remove()
		{
			return remove.bind(null);
		}
	});
})();