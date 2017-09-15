{
	const state = (function(){
		
		const buttonsEnabled = [true, true, true];

		return {
			elementsShown: {},
			buttonEnabled: function(button)
			{
				return buttonsEnabled[button];
			},
			enableButton: function(button)
			{
				buttonsEnabled[button] = true;
			},
			disableButton: function(button)
			{
				buttonsEnabled[button] = false;
			},
			get shownElements()
			{
				const list = [];
				for(const id in state.elementsShown)
				{
					list.push(state.elementsShown[id].ref);
				}
				return list;
			},
			study: (function()
			{
				let currentCardIndex = 0;
				let flipped = false;
				let cards = Flashcards.list;
				return {
					get cards()
					{
						return cards
					},
					get currentCardIndex()
					{
						return currentCardIndex;
					},
					set currentCardIndex(val)
					{
						state.disableButton(0);
						current_flashcard.style.top = "-1000px";
						setTimeout(function()
						{
							current_flashcard.style.transition = "none";
							current_flashcard.style.top = "1000px";
							currentCardIndex = val;
							displayed_word_container.innerText = (flipped)
								? state.study.cards[currentCardIndex].nativeWord
								: state.study.cards[currentCardIndex].studyWord;
							back_interface.style.display = (flipped)?"table-row": "none";
							front_interface.style.display = (!flipped)?"table-row": "none";

							setTimeout(function()
							{
								current_flashcard.style.transition = "";
								current_flashcard.style.top = "10%";
								state.enableButton(0);
							}, 400);
						}, 400);

					},
					get flipped()
					{
						return flipped;
					},
					set flipped(val)
					{
						state.disableButton(0);
						flipped = val;
						current_flashcard.style.transform = "rotateY(90deg)";
						setTimeout(function()
						{
							back_interface.style.display = (flipped)?"table-row": "none";
							front_interface.style.display = (!flipped)?"table-row": "none";

							displayed_word_container.innerText = (flipped)
								? state.study.cards[currentCardIndex].nativeWord
								: state.study.cards[currentCardIndex].studyWord;
							current_flashcard.style.transform = "rotateY(0deg)";
						}, 700);

						setTimeout(function()
						{
							current_flashcard.style["background-color"] = "#aaa";
							// current_flashcard.style["border-color"] = "#aaa";
						}, 200);

						setTimeout(function()
						{
							current_flashcard.style["background-color"] = "";
							// current_flashcard.style["border-color"] = "";
						}, 700);

						setTimeout(function()
						{
							state.enableButton(0);
						}, 1000);
					},
					reset: function()
					{
						cards = Flashcards.list;
						currentCardIndex = 0;
						flipped = false;
						back_interface.style.display = "none:";
						front_interface.style.display = "table-row";
						displayed_word_container.innerText = state.study.cards[currentCardIndex].studyWord;
					},
					shuffle: function()
					{
						
					}
				};
			})()
		};
	})();

	oncontextmenu = function(e)
	{
		e.preventDefault();
	};

	onmouseup = function(e)
	{
		const idMouseupEvents = {

			ids:
			{
				add_card_button:
				{
					show: flashcard_creator
				},
				show_cards_button:
				{
					toggle: card_list
				},
				finalize_card_button:
				{
					perform: function()
					{
						Flashcards.add({studyWord: input_study_word.value, nativeWord: input_native_word.value });
						input_study_word.value = "";
						input_native_word.value = "";
					}
				},
				cancel_card_button:
				{
					hide: flashcard_creator
				},
				start_study_button:
				{	
					perform: function()
					{
						state.study.reset();
						state.study.shuffle();
					},
					hide: state.shownElements,
					show: current_flashcard,
					disable: [add_card_button, show_cards_button, start_study_button],

				},
				flip_button:
				{
					perform: function()
					{
						state.study.flipped = !state.study.flipped;
					}
				},
				answer_button:
				{
					perform: function()
					{
						if(util.compareCaseInsensitive(answer_input.value, state.study.cards[state.study.currentCardIndex].nativeWord))
						{
							state.study.currentCardIndex = (state.study.currentCardIndex + 1) % state.study.cards.length;
						}
					}
				},
				next_button:
				{
					perform: function()
					{
						state.study.flipped = false;
						state.study.currentCardIndex = (state.study.currentCardIndex + 1) % state.study.cards.length;
					}
				}
			},
			functions: (function()
			{
				const elementsShown = state.elementsShown;

				const funcs = {
					perform: function(arg)
					{
						if(typeof arg === "function")
							{ arg(); };
					},
					show: function(arg)
					{
						const elements = util.array(arg);

						for(const element of elements)
						{
							if(!(elementsShown[element.id] || {shown: false}).shown )
							{
								elementsShown[element.id] = {ref: element, shown: true};
								const position = util.getPositionInParentElement(e.target.parentElement);
								const displayContainer = display_containers.children[position];
								displayContainer.appendChild(element);
							}
						}
					},
					hide: function(arg)
					{
						const elements = util.array(arg);

						for(const element of elements)
						{
							if((elementsShown[element.id] || {shown: false}).shown )
							{
								elementsShown[element.id] = {ref: element, shown: false};
								inactive_items.appendChild(element);
							}
						}
					},
					toggle: function(arg)
					{
						const elements = util.array(arg);

						for(const element of elements)
						{
							if((elementsShown[element.id] || {shown: false}).shown )
								{ funcs.hide(element); }
							else
								{ funcs.show(element); }
						}
					},
					disable: function(...ids)
					{
						if(Array.isArray(ids[0]))
							{ ids = ids[0]; }
						for(const id of util.array(ids))
						{
							const el = (typeof id === "string") ? document.querySelector(`#${id}`) : id;
							idMouseupEvents.ids[el.id].disabled = true;
							el.style.filter = "blur(1px)";
							el.disabled = true;
						}
					},
					enable: function(...ids)
					{
						if(Array.isArray(ids[0]))
							{ ids = ids[0]; }
						for(const id of util.array(ids))
						{
							const el = (typeof id === "string") ? document.querySelector(`#${id}`) : id;
							idMouseupEvents.ids[el.id].disabled = false;
							el.style.filter = "";
							el.disabled = false;
						}
					}
				};

				const obj = Object.create(null);

				for(const func in funcs)
				{
					Object.defineProperty(obj, func,
					{
						get: function() { return funcs[func].bind(null); }
					});
				}

				return Object.freeze(obj);

			})()
		};

		(state.buttonEnabled(e.button) && [
			function()
			{
				const id = e.target.id;
				if(!(idMouseupEvents.ids[id] || {disabled: true}).disabled)
				{
					for(const func in idMouseupEvents.ids[id])
					{
						idMouseupEvents.functions[func](idMouseupEvents.ids[id][func]);
					}
				}
			},
			function()
			{
				console.log("middle click");
			},
			function()
			{
				idMouseupEvents.functions.enable(Object.keys(idMouseupEvents.ids));
				idMouseupEvents.functions.hide(current_flashcard);
			}
		][e.button] || function(){})();
	};
}