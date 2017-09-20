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
						answer_input.value = "";
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
							}, 200);
						}, 200);

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
							current_flashcard.style["background-color"] = "";
						}, 150);

						setTimeout(function()
						{
							current_flashcard.style["background-color"] = "#aaa";
						}, 50);

						setTimeout(function()
						{
							state.enableButton(0);
						}, 200);
					},
					reset: function(shuffle = false)
					{
						cards = Flashcards.list;

						for(let i = 0; shuffle && i < cards.length; i++)
						{
							const k = ~~(Math.random() * cards.length - i) + i;
							const temp = cards[k];
							cards[k] = cards[i];
							cards[i] = temp;
						}

						currentCardIndex = 0;
						flipped = false;
						back_interface.style.display = "none";
						front_interface.style.display = "table-row";
						displayed_word_container.innerText = state.study.cards[currentCardIndex].studyWord;
					}
				};
			})()
		};
	})();

	onmousemove = function(e)
	{
		mouse_tooltip.style.top = e.y + "px";
		mouse_tooltip.style.left = (e.x + 20) + "px";
	}

	onmouseover = function(e)
	{
		const mouseTooltips = {
			ids:
			{
				flashcard_container: "CLICK TO QUIT STUDY SESSION"
			}
		}

		mouse_tooltip.innerText = (mouseTooltips.ids[e.target.id] || "");
	}

	onmouseout = function(e)
	{
		mouse_tooltip.innerText = "";
	}

	oncontextmenu = function(e)
	{
		//e.preventDefault();
	};

	onmouseup = function(e)
	{
		const mouseupEvents = {
			classes:
			{
				removeButton:
				{
					perform: function()
					{
						const idToRemove = util.extractInt(e.target.id);
						Flashcards.remove(idToRemove);
					}
				}
			},
			ids:
			{			
				flashcard_container:
				{
					hide: flashcard_container,
					perform: function()
					{
						mouseupEvents.functions.enable(Object.keys(mouseupEvents.ids));
						mouse_tooltip.innerText = "";
					}
				},
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
						state.study.reset(shuffle=true);
					},
					hide: state.shownElements,
					show: flashcard_container,
					disable: [add_card_button, show_cards_button, start_study_button],

				},
				flip_button:
				{
					perform: function()
					{
						state.study.flipped = !state.study.flipped;
						Media.sound("sounds/card1.wav").play();
					}
				},
				answer_button:
				{
					perform: function()
					{
						if(util.compareCaseInsensitive(answer_input.value, state.study.cards[state.study.currentCardIndex].nativeWord))
						{
							state.disableButton(0);
							util.chainDelay(50)
							(function()
							{
								answer_result_success.style.filter = "opacity(1)";
								Media.sound("sounds/coin1.wav").play();
							})
							(500)(function()
							{
								state.study.currentCardIndex = (state.study.currentCardIndex + 1) % state.study.cards.length;
								Media.sound("sounds/card2.wav").play();
							})
							(50)(function()
							{
								answer_result_success.style.filter = "opacity(0)";
								state.enableButton(0);
							})
						}
						else
						{
							util.chainDelay(50)
							(function()
							{
								current_flashcard.style.filter = "blur(1px)";
								answer_result_failure.style.filter = "opacity(1)";
								Media.sound("sounds/card3.wav").play();
							})
							(function(){current_flashcard.style.left = "33.5%";})
							(function(){current_flashcard.style.left = "36.5%";})
							(function(){current_flashcard.style.left = "34%";})
							(function(){current_flashcard.style.left = "36%";})
							(function(){current_flashcard.style.left = "34.5%";})
							(function(){current_flashcard.style.left = "35.5%";})
							(function(){current_flashcard.style.left = "34.5%";})
							(function(){current_flashcard.style.left = "35.5%";})
							(function(){current_flashcard.style.left = "";})
							(function()
							{
								current_flashcard.style.filter = "";
								answer_result_failure.style.filter = "opacity(0)";
							})
						}
					}
				},
				next_button:
				{
					perform: function()
					{
						state.study.flipped = false;
						state.study.currentCardIndex = (state.study.currentCardIndex + 1) % state.study.cards.length;
						Media.sound("sounds/card2.wav").play();
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
							mouseupEvents.ids[el.id].disabled = true;
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
							mouseupEvents.ids[el.id].disabled = false;
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
				const classes = e.target.className.split(" ");
				if(!(mouseupEvents.ids[id] || {disabled: true}).disabled)
				{
					for(const func in mouseupEvents.ids[id])
					{
						mouseupEvents.functions[func](mouseupEvents.ids[id][func]);
					}
				}

				for(const cl of classes)
				{
					if(!(mouseupEvents.classes[cl] || {disabled: true}).disabled)
					{
						for(const func in mouseupEvents.classes[cl])
						{
							mouseupEvents.functions[func](mouseupEvents.classes[cl][func]);
						}
					}
				}
			},
			function()
			{
				console.log("middle click");
			},
			function()
			{
				console.log("right click");
			}
		][e.button] || function(){})();
	};
}