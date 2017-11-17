var pngFileNames = []; //array of PNG files downloaded
var casper = require('casper').create({
    verbose: false,
    logLevel: "debug"
});
var x = require('casper').selectXPath;
var fs = require('fs');

//Get the Google Books ID from the command line:
casper.cli.drop("cli");
casper.cli.drop("casper-path");
if (casper.cli.args.length === 0) {
    casper.echo("Please pass the Google Books ID (e.g., zAsjkHJ8aP8C) to the command line.").exit();
}
var url = 'https://books.google.com/books?id=' + casper.cli.args[0] + '&printsec=frontcover#v=onepage&q&f=false';

casper.start(url);

casper.on('resource.received', function(resource) {
    var URL = resource.url;
    if (URL.indexOf("content?") !== -1 &&
        URL.indexOf("&pg=") !== -1 &&
        URL.indexOf("&img=1") !== -1) { //if it's an image URL

        //form file name with 4-digit numbers padded with zero:
        var pgPrefix = URL.substring(URL.indexOf("&pg=P") + 5, URL.indexOf("&pg=P") + 6);
        var pgNum = URL.substring(URL.indexOf("&pg=P") + 6, URL.indexOf("&img"));
        var pgNumPadded = String("000" + pgNum).slice(-4);
        var file = pgPrefix + pgNumPadded + ".png";

        if (pngFileNames.indexOf(file) === -1 && !fs.exists(file)) {
            try {
                this.echo(file);
                casper.download(URL, file);
                pngFileNames.push(file); // keep track of downloaded PNGs
            } catch (e) {
                this.echo(e);
            }
        }
    } else if (URL.indexOf("&jscmd=click3") !== -1) { //advance to next page
        this.click(x('//*[@src="/googlebooks/images/kennedy/page_right.png"]'));
    }
});

casper.run();

