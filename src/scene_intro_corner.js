
Blind.scene_intro_corner = (function(){
	var script;
	var map;

	function init() {
		Blind.lid.reset();
		Blind.lid.open();

		map = new Blind.Map(Blind.assets.json["map_intro_corner"]);

		Blind.camera.init(map);
		Blind.camera.enableViewKeys();
		Blind.camera.enableMoveKeys();
		Blind.camera.enableProjKeys();

		Blind.camera.setPosition(347.46444556800026, 64.52036424518725);
		Blind.camera.setAngle(-4.707877653327046);
		Blind.camera.updateProjection();

		script = new Blind.TimedScript([
			{
				time: 1,
				action: function() {
					Blind.caption.show('msg_corner00', 2);
				},
			},
		]);

		Blind.camera.addCollideAction('me', function() {
			Blind.caption.show('msg_corner01',2);
			script = new Blind.TimedScript([
				{
					time: 4,
					action: function() {
						Blind.setScene(Blind.scene_stages);
					},
				},
			]);
		});
	}

	function cleanup() {
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
		Blind.camera.disableProjKeys();
	}

	function draw(ctx) {
		ctx.fillStyle = "#222";
		ctx.fillRect(0,0,Blind.canvas.width, Blind.canvas.height);

		Blind.camera.draw(ctx);
		Blind.caption.draw(ctx);

		Blind.lid.draw(ctx);
	}

	function update(dt) {
		Blind.camera.update(dt);
		Blind.lid.update(dt);
		Blind.caption.update(dt);
		script.update(dt);
	}

	return {
		init: init,
		draw: draw,
		update: update,
	};
})();
