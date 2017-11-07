var pngFileNames = []; //array of PNG files downloaded
var casper = require('casper').create({
    verbose: false,
    logLevel: "debug"
});
var x = require('casper').selectXPath;

//Get the Google Books ID from the command line:
casper.cli.drop("cli");
casper.cli.drop("casper-path");
if (casper.cli.args.length === 0 && Object.keys(casper.cli.options).length === 0) {
    casper.echo("Please pass the Google Books ID (e.g., zAsjkHJ8aP8C) to the command line.").exit();
}
var url = 'https://books.google.com/books?id=' + casper.cli.args[0] + '&printsec=frontcover#v=onepage&q&f=false';

casper.start(url);

casper.on('resource.received', function(resource) {
    var URL = resource.url;
    if (URL.indexOf("content?") !== -1 &&
        URL.indexOf("&pg=") !== -1 &&
        URL.indexOf("&img=1") !== -1) { //if it's an image URL
        var file = URL.substring(URL.indexOf("&pg=") + 4, URL.indexOf("&img")) + ".png";
        if (pngFileNames.indexOf(file) === -1) {
            try {
                this.echo(file);
                casper.download(URL, file);
                pngFileNames.push(file); // keep track of downloaded PNGs
            } catch (e) {
                this.echo(e);
            }
        }
    } else if (URL.indexOf("&jscmd=click3") !== -1) { //if the page is unavailable
        this.click(x('//*[@src="/googlebooks/images/kennedy/page_right.png"]'));
    }
});

casper.run();
