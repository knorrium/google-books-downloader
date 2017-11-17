#!/bin/bash

#delete PNGs with SHA256 checksum matching reference file

refShaSum=`sha256sum ${1:Reference PNG} | awk '{print $1}'`

for i in *.png
do
	shaSum=`sha256sum $i | awk '{print $1}'`
	if [ $shasum = $refShaSum ]
	then
		rm -v $i
	fi
done

