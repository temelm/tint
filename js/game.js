var game = {
	isDebug: true
};

game.log = function(message, level) {
	level = (typeof level === "string" && level.toLowerCase() === "error") ? "error" : "log";
	if (game.isDebug && typeof console === "object" && typeof console[level] === "function") {
		console[level](">>>> [TINT]", message);
	}
};

game.init = function() {
	try {
		game.level = 1;
		jQuery('#level').html(game.level);
		game.time = 60;
		jQuery('#time').html(game.time);
	} catch (e) {
		game.log("init: " + e.message, "error");
	}
};

game.getNumRows = function() {
	try {
		if (game.level <= 4) return (game.level + 1);
		else if (game.level === 5) return 5;
		else if (game.level >= 6 && game.level <= 8) return 6;
		else if (game.level >= 9 && game.level <= 12) return 7;
		else if (game.level >= 13 && game.level <= 17) return 8;
		else if (game.level >= 18) return 9;
	} catch (e) {
		game.log("getNumRows: " + e.message, "error");
	}
};

game.getTileColor = function() {
	try {
		return Please.make_color();
	} catch (e) {
		game.log("getTileColor: " + e.message, "error");
	}
};

game.getDiffTileId = function() {
	try {
		return ("tile" + Math.floor(Math.random() * Math.pow(game.getNumRows(), 2)));
	} catch (e) {
		game.log("getDiffTileId: " + e.message, "error");
	}
};

game.getLuminanceFactor = function() {
	try {
		if (game.level <= 3) return 0.48;
		else if (game.level >= 4 && game.level <= 5) return 0.4;
		else if (game.level >= 6 && game.level <= 8) return 0.32;
		else if (game.level >= 9 && game.level <= 12) return 0.24;
		else if (game.level >= 13 && game.level <= 17) return 0.16;
		else if (game.level >= 18 && game.level <= 23) return 0.12;
		else if (game.level >= 24) return 0.08;
	} catch (e) {
		game.log("getLuminanceFactor: " + e.message, "error");
	}
};

/**
 * http://www.sitepoint.com/javascript-generate-lighter-darker-color/
 */
game.changeLuminance = function(hex, lum) {
	try {
		hex = String(hex).replace(/[^0-9a-f]/gi, "");
		if (hex.length < 6) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		lum = lum || 0;
		var rgb = "#";
		for (var i = 0; i < 3; i++) {
			var c = parseInt(hex.substr(i * 2, 2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00" + c).substr(c.length);
		}
		return rgb;
	} catch (e) {
		game.log("changeLuminance: " + e.message, "error");
	}
};

game.addTiles = function() {
	try {
		jQuery('#tileset table').remove();

		var r = game.getNumRows();
		var tileColor = game.getTileColor();
		var diffTileId = game.getDiffTileId();
		var tbl = "<table>";
		for (var i = 0; i < r; i++) {
			tbl += "<tr>";
			for (var j = 0; j < r; j++) {
				var tileClass = "tile";
				var tileId = "tile" + ((r * i) + j);
				var tileStyle = "background-color:" + tileColor + ";";
				if (tileId === diffTileId) {
					tileClass += " diff";
					tileStyle = "background-color:" + game.changeLuminance(tileColor, game.getLuminanceFactor()) + ";";
				}
				tbl += "<td class=\"" + tileClass + "\" id=\"" + tileId + "\" style=\"" + tileStyle + "\"></td>";
			}
			tbl += "</tr>";
		}
		tbl += "</table>";
		jQuery('#tileset').append(tbl);
		jQuery('.diff').click(game.getNextLevel);
	} catch (e) {
		game.log("addTiles: " + e.message, "error");
	}
};

game.getNextLevel = function() {
	try {
		game.level++;
		jQuery('#level').html(game.level);
		game.addTiles();
	} catch (e) {
		game.log("getNextLevel: " + e.message, "error");
	}
};

////////////////////////////////////////////////////////////////

game.FN = function() {
    try {
        // TODO: Implement
    } catch (e) {
        game.log("FN: " + e.message, "error");
    }
};