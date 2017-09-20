const util = (function(){

	const _extractNumber = function(str)
	{
		let num = "";
		for(let i = 0; i < str.length; i++)
		{
			const chCode = str.charCodeAt(i);
			if(chCode > 47 && chCode < 58 || chCode === 46)
				{ num += str[i]; }
		}
		return this(num);
	}

	const funcs = {
		getFunctionBody: function(f)
		{
			if(typeof(f) === "function")
			{
				const str = f.toString();
				const body = str.slice(str.indexOf("{") + 1, str.lastIndexOf("}"));
				return body;
			}
		},
		getDocumentElementsWithIDs: function()
		{
			const elements = [];
			const IDs = [];
			for(let el of document.all)
			{
				if(el.id !== "")
				{
					elements.push(el);
					IDs.push(el.id);
				}
			}
			return {elements: elements, IDs: IDs};
		},
		getPositionInParentElement: function(el)
		{
			let count = -1;
			const breakLimit = 10000;
			while(el !== null)
			{
				count++;
				el = el.previousElementSibling;
				if(count >= breakLimit)
				{
					return;
				}
			}
			return count;
		},
		array: function(arg)
		{
			if(!Array.isArray(arg))
				{ return [arg]; }
			return [...arg];
		},
		compareCaseInsensitive: function(word1, word2)
		{
			return word1.toLowerCase() === word2.toLowerCase();
		},
		chainDelay: function(ms)
		{
			const queue = [];
			repeat(0, ms);
			function repeat(i, delay)
			{
				setTimeout(function()
				{
					if(i < queue.length)
					{
						queue[i].callback();
						i++;
						repeat(i, (queue[i] || {delay:0}).delay);
					}
				}, delay);
			}
			function chain(callback)
			{
				if(typeof callback === "function")
					{ callback = [callback]; }
				
				if(Array.isArray(callback))
				{
					for(const func of callback)
					{
						queue.push({callback: func, delay: ms});
					}
				}
				else if(typeof callback === "number")
				{
					ms = callback;
				}
				return chain;
			}
			return chain;
		},
		extractInt: _extractNumber.bind(parseInt),
		extractFloat: _extractNumber.bind(parseFloat)
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

})();