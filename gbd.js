/*jslint node: true */
/*jslint browser: true */
/*jslint plusplus: true */

var pages = [];

//TODO: load the URL from the command line
var url = "http://books.google.com.br/books?id=AS4DAAAAMBAJ&printsec=frontcover&hl=pt-BR&source=gbs_ge_summary_r&cad=0#v=onepage&q&f=false";

Array.prototype.exists = function (search) {
    "use strict";
    var i;
    for (i = 0; i < this.length; i++) {
        if (this[i] === search) {
            return true;
        }
    }
    return false;
};

var casper = require('casper').create({
    onError: function (self, m) {
        "use strict";
        console.log('FATAL:' + m);
        self.exit();
    },
    viewportSize: {
        width: 1024,
        height: 600
    }
});

casper.start(url, function () {
    "use strict";
    var loading_div, page_down;
    loading_div = "div[style*='position: absolute; left: 0px; color: rgb(128, 128, 128); font-size: 13px; background-color: white; bottom: 0px; -webkit-user-select: none;']";
    page_down = ".SPRITE_page_down";
    casper.then(function () {

        this.waitFor(
            function () {
                this.click(page_down);

                var elem, current_position;

                elem = this.evaluate(function () {
                    var viewport_div, elem;
                    viewport_div = "div[id='viewport'] > div > div > div";
                    elem = document.querySelector(viewport_div).offsetParent;
                    return elem;
                });

                current_position = elem.scrollHeight - elem.scrollTop - elem.offsetHeight;
                return (elem.scrollHeight - elem.scrollTop - elem.offsetHeight === 0);
            },
            function () {
                // this.echo("Done scrolling");
            },
            function () {
                // this.echo("Timeout!?");
            },
            Infinity //This is a strong candidate to win a TheDailyWTF award :)
        );
    });
});

casper.on('resource.received', function (resource) {
    "use strict";
    if ((resource.url.indexOf("&pg=P") !== -1) && (resource.url.indexOf("&jscmd=click3") === -1)) {
        if (!pages.exists(resource.url)) {
            pages.push(resource.url);
            var url, file;
            url = resource.url;
            file = (url.substring(url.indexOf("&pg=") + 4, url.indexOf("&img"))) + ".png";
            this.echo("wget --quiet --output-document='" + file + "' --user-agent=\"Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.3) Gecko/2008092416 Firefox/3.0.3\" '" + resource.url + "'");
            //TODO: Implement this when CasperJS issue #73 is fixed: https://github.com/n1k0/casperjs/issues/73
            // try { 
            //     casper.download(resource.url, file);
            // }
        }
    }
});

casper.run();
