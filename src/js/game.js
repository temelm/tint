var game = {
	isDebug: false,
	isMute: false,
	isMuteKey: "tintIsMute",
	nextLevelSound: new Audio("sound/next-level.mp3"),
	numGamesPlayedKey: "tintNumGamesPlayed",
	highestLevelReachedKey: "tintHighestLevelReached"
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
		
		game.duration = 0;
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
 * Craig Buckler. 2011. How to Calculate Lighter or Darker Hex Colors in JavaScript. [ONLINE] Available at: http://www.sitepoint.com/javascript-generate-lighter-darker-color/. [Accessed 15 December 15].
 * @param {string} hex
 * @param {number} lum
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
		jQuery('#tileset table').remove(); // Cleanup.

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
		if (!game.isMute) {
			game.nextLevelSound.play();
		}
		game.level++;
		jQuery('#level').html(game.level);
		game.addTiles();
	} catch (e) {
		game.log("getNextLevel: " + e.message, "error");
	}
};

game.getNumGamesPlayed = function() {
	try {
		if (typeof window.localStorage !== "undefined" && typeof window.localStorage.getItem === "function") {
			var r = window.localStorage.getItem(game.numGamesPlayedKey);
			return (r) ? parseInt(r, 10) : 0;
		} else {
			game.log("getNumGamesPlayed: window.localStorage not supported!");
			return 0;
		}
	} catch (e) {
		game.log("getNumGamesPlayed: " + e.message, "error");
	}
};

game.incrementNumGamesPlayed = function() {
	try {
		if (typeof window.localStorage !== "undefined" && typeof window.localStorage.getItem === "function" && typeof window.localStorage.setItem === "function") {
			window.localStorage.setItem(game.numGamesPlayedKey, game.getNumGamesPlayed() + 1);
		} else {
			game.log("incrementNumGamesPlayed: window.localStorage not supported!");
		}
	} catch (e) {
		game.log("incrementNumGamesPlayed: " + e.message, "error");
	}
};

game.getHighestLevelReached = function() {
	try {
		if (typeof window.localStorage !== "undefined" && typeof window.localStorage.getItem === "function") {
			var r = window.localStorage.getItem(game.highestLevelReachedKey);
			return (r) ? parseInt(r, 10) : null;
		} else {
			game.log("getHighestLevelReached: window.localStorage not supported!");
			return null;
		}
	} catch (e) {
		game.log("getHighestLevelReached: " + e.message, "error");
	}
};

game.setHighestLevelReached = function(newHighestLevelReached) {
	try {
		if (typeof newHighestLevelReached === "number" && typeof window.localStorage !== "undefined" && typeof window.localStorage.setItem === "function") {
			window.localStorage.setItem(game.highestLevelReachedKey, newHighestLevelReached);
		} else {
			// TODO: ADD LOGGING
		}
	} catch (e) {
		game.log("setHighestLevelReached: " + e.message, "error");
	}
};

game.clearStats = function () {
	try {
		if (typeof window.localStorage !== "undefined" && typeof window.localStorage.removeItem === "function") {
			window.localStorage.removeItem(game.numGamesPlayedKey);
			window.localStorage.removeItem(game.highestLevelReachedKey);
			jQuery('#games-played').html('0');
			jQuery('#highest-level-reached').html('N/A');
		} else {
			game.log("clearStats: window.localStorage not supported!");
		}
	} catch (e) {
		game.log("clearStats: " + e.message, "error");
	}
};

game.countdown = function() {
	try {
		game.duration++;
		
		game.time -= 1;
		jQuery('#time').html(game.time);
		if (game.time === 0) {
			clearInterval(game.countdownInterval);
			game.incrementNumGamesPlayed();
			if (!game.getHighestLevelReached() || game.level > game.getHighestLevelReached()) {
				game.setHighestLevelReached(game.level);
			}
			if (confirm("game over!\n\nlevel reached: " + game.level + "\n\nreplay?")) {
				game.restart();
			} else {
				jQuery.mobile.changePage("#main-menu");
			}
		}
	} catch (e) {
		game.log("countdown: " + e.message, "error");
	}
};

game.start = function() {
	try {
		game.init();
		game.addTiles();
		game.countdownInterval = setInterval(game.countdown, 1000);
	} catch (e) {
		game.log("start: " + e.message, "error");
	}
};

game.pause = function() {
	try {
		clearInterval(game.countdownInterval);
		jQuery('#paused-level').html('current level: ' + game.level);
		jQuery('#paused-time').html('time left: ' + game.time);
		jQuery.mobile.changePage("#paused");
	} catch (e) {
		game.log("pause: " + e.message, "error");
	}
};

game.resume = function() {
	try {
		jQuery.mobile.changePage("#play");
		game.countdownInterval = setInterval(game.countdown, 1000);
	} catch (e) {
		game.log("resume: " + e.message, "error");
	}
};

game.restart = function() {
	try {
		clearInterval(game.countdownInterval);
		game.init();
		game.addTiles();
		jQuery.mobile.changePage("#play");
		game.countdownInterval = setInterval(game.countdown, 1000);
	} catch (e) {
		game.log("restart: " + e.message, "error");
	}
};

game.quit = function() {
	try {
		clearInterval(game.countdownInterval);
		jQuery.mobile.changePage("#main-menu");
	} catch (e) {
		game.log("quit: " + e.message, "error");
	}
};

game.mute = function() {
	try {
		game.isMute = true;
		game.nextLevelSound.muted = true;
		jQuery('#mute-btn').hide();
		jQuery('#unmute-btn').show();
		if (typeof window.localStorage !== "undefined" && typeof window.localStorage.setItem === "function") {
			window.localStorage.setItem(game.isMuteKey, "true");
		}
	} catch (e) {
		game.log("mute: " + e.message, "error");
	}
};

game.unmute = function() {
	try {
		game.isMute = false;
		game.nextLevelSound.muted = false;
		jQuery('#unmute-btn').hide();
		jQuery('#mute-btn').show();
		if (typeof window.localStorage !== "undefined" && typeof window.localStorage.setItem === "function") {
			window.localStorage.setItem(game.isMuteKey, "false");
		}
	} catch (e) {
		game.log("unmute: " + e.message, "error");
	}
};

game.boot = function() {
	try {
		jQuery.mobile.defaultPageTransition = "flip";
		
		// Add click events to the 'mute-btn'/'unmute-btn' buttons.
		if (typeof window.localStorage !== "undefined" && typeof window.localStorage.getItem === "function") {
			var r = window.localStorage.getItem(game.isMuteKey);
			game.isMute = (r && r === "true") ? true : false;
		} else {
			game.isMute = false;
		}
		if (game.isMute) {
			game.mute();
		} else {
			game.unmute();
		}
		jQuery('#mute-btn').click(game.mute);
		jQuery('#unmute-btn').click(game.unmute);
		
		// Add click events to the 'main-menu' page buttons.
		jQuery('#main-menu a[href*="play"]').click(game.start);
		jQuery('#main-menu a[href*="stats"]').click(function() {
			jQuery('#games-played').html(game.getNumGamesPlayed());
			var tmp = (!!game.getHighestLevelReached()) ? game.getHighestLevelReached() : "N/A";
			jQuery('#highest-level-reached').html(tmp);
		});

		// Add click events to the 'play' page buttons.
		jQuery('#pause-btn').click(game.pause);
		
		// Add click events to the 'stats' page buttons.
		jQuery('#stats a:contains("clear")').click(function() {
			if (confirm("are you sure?")) {
				game.clearStats();
			}
		});
		
		// Add click events to the 'paused' page buttons.
		jQuery('#resume-btn').click(game.resume);
		jQuery('#restart-btn').click(game.restart);
		jQuery('#quit-btn').click(game.quit);

		game.verticallyCenterPage = function(pageId) {
			try {
				if (typeof pageId === "string" && pageId.length > 0 && jQuery('#' + pageId).length > 0) {
					var headerHeight = jQuery('#' + pageId + ' [data-role="header"]').height();
					var footerHeight = jQuery('#' + pageId + ' [data-role="footer"]').height();
					var content = jQuery('#' + pageId + ' .ui-content');
					var marginTop = (jQuery(window).height() - headerHeight - footerHeight - jQuery(content).outerHeight()) / 2;
					jQuery(content).css('margin-top', marginTop + 'px');
				}
			} catch (e) {
				game.log("verticallyCenterPage: " + e.message, "error");
			}
		};

		jQuery(document).ready(function() {
			jQuery('.muted-unmuted').css('top', (((jQuery('#main-menu .ui-header').height() - jQuery('#mute-btn').height()) / 2) + 'px'));
			
			game.verticallyCenterPage("main-menu");
			
			// Make text unselectable.
			jQuery('body').addClass('unselectable');
		});
		
		jQuery(document).on('pagecontainerbeforeshow', function(toPage) {
			var pageId = toPage.currentTarget.URL;
			if (pageId.match(/\#stats|\#help|\#paused/i)) {
				pageId = pageId.match(/\#stats|\#help|\#paused/i)[0].replace("#", "");
				jQuery('#' + pageId + " .ui-content").css('visibility', 'hidden');
				game.tmpPageId = pageId;
				setTimeout(function() {
					jQuery('#' + game.tmpPageId + " .ui-content").css('visibility', 'visible');
				}, 1000);
			}
			
		});
		
		jQuery(document).on('pagecontainershow', function() {
			game.verticallyCenterPage(game.tmpPageId);
			jQuery('#' + game.tmpPageId + " .ui-content").css('visibility', 'visible');
		});
	} catch (e) {
		game.log("boot: " + e.message, "error");
	}
};

////////////////////////////////////////////////////////////////

game.useFiftyFiftyJoker = function() {
	try {
		function arrayContains(a, e) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === e) {
					return true;
				}
			}
			return false;
		}
		var numTiles = Math.pow(game.getNumRows(), 2);
		var numTilesToHide = Math.floor(numTiles / 2);
		var tilesToHide = [];
		while (numTilesToHide > 0) {
			var r = Math.floor(Math.random() * numTiles);
			if (("tile" + r) !== jQuery('.diff').attr('id').trim() && !arrayContains(tilesToHide, "tile" + r)) {
				tilesToHide.push("tile" + r);
				numTilesToHide--;
			}
		}
		for (var i = 0; i < tilesToHide.length; i++) {
			jQuery('#' + tilesToHide[i]).css('visibility', 'hidden');
		}
	} catch (e) {
		game.log("useFiftyFiftyJoker: " + e.message, "error");
	}
};