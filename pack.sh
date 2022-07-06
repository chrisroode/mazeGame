#!/bin/bash
# This script looks for an HTML <script src=""> tag and in the place of it's line puts the contents of the file.  The script is rather dumb, looking for "<script" literal at the beginning of the line and then deliminates to the path name, deletes out the "./" from the start of the line and hopes/prays for the best.  It's working at the moment.  You need to have the script in the folder that the file is, and call it from that working directory.


if [ "$#" -ne 2 ] || ! [ -f "$1" ]; then
  echo "Usage: $0 <input path> <output path>" >&2
  exit 1
fi
if [ -f "$2" ]; then
  echo "Output file already exists, please use a different name." >&2
  exit 1
fi


while read LINE
do
  if [ ${#LINE} -gt 0 ]
  then
    IFS=' '
    read -a TEST <<< $LINE
    if [ ${TEST[0]} = "<script" ]
    then
      IFS='"'
      read -a JSPATH <<< ${TEST[2]}
      echo "<script>" >> $2
      cat ${JSPATH#" ./"} >> $2
      echo "</script>" >> $2
    else
      echo $LINE >> $2
    fi
  fi
done < $1
