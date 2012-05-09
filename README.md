google-books-downloader
=======================

Just a proof of concept Google Books downloader.

This script started as a pet project to learn about CasperJS, but since it might be helpful to other people, I have decided to release it.

Google Books is a great source of information, but I would love to have an offline version of some books to read later on my iPad.

I wanted to scrape the HTML and extract all the image information that contains the actual pages, but Google Books implements lazy loading to download the pages as you scroll down on the page.

Thus, the only way to extract the images is using an actual, javascript enabled browser. Or a a headless implementation of one, and this is where PhantomJS comes in :)

I have put together some very ugly code that loads a book on Google Books, scrolls all the way down and prints the URLs for the files so you can download them all with wget.

In the future, I would like to generate a PDF with all the pages together. Wanna help me out? :)

Dependencies
------------

- CapserJS 0.6.6
- PhantomJS 1.5
- wget

Known Limitations
-----------------

- The book URL is hardcoded
- The script does not actually download books, but rather prints a list of wget commands you must run (due to a download bug in CasperJS), I suggest redirecting the output to a .sh or .bat file
- It does not download books with limited preview (though I have plans to add proxy and Tor support to bypass the preview limitation :)

Usage
-----

`casperjs > pages.sh
sh pages.sh`

TODO
----

`[ ] Load the URL from the command line
[ ] Change the filenames to make it easier to combine or read all the files
[ ] Merge the files to PDF`