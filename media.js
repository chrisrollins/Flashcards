const Media = (function(){
	
	const sounds = {};
	const muted = {};
	let allMuted = false;

	const funcs = {
		sound: function(url)
		{
			if(!sounds[url])
				{sounds[url] = new Audio(url);}

			return {
				mute: function()
				{
					mute[url] = true;
				},
				unmute: function()
				{
					mute[url] = false;
				},
				play: function()
				{
					if(!muted[url] && !allMuted)
					{
						sounds[url].currentTime = 0;
						sounds[url].play();
					}
				},
				audioObject: sounds[url]
			}
		}
	}

	funcs.sound.mute = Object.freeze(function()
	{
		allMuted = true;
	});

	funcs.sound.unmute = Object.freeze(function()
	{
		allMuted = false;
	});

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