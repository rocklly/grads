#!/bin/csh -f
#THIS SCRIPT KICKS OFF GEFS MODEL	
#LAST EDIT:  1-15-2015  GENSINI									
#LAST EDIT: 2-3-2017 GENSINI
#####################################################
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#LOCATION OF RUNNER SCRIPT
set Runner = "/home/scripts/grads/runners/gefs_runner.csh"
#Launch downloader script
csh /home/scripts/grads/kickers/gefs_downloader.csh $ModRunTime &
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
set dateForDir = `date -u +%Y%m%d`${ModRunTime}
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20150114" 
#set filstr = "150114"
sleep 15
#BEGIN LOOP
foreach FHour (000 006 012 018 024 030 036 042 048 054 060 066 072 078 084 090 096 102 108 114 120 126 132 138 144 150 156 162 168 174 180 186 192 198 204 210 216 222 228 234 240 246 252 258 264 270 276 282 288 294 300 306 312 318 324 330 336 342 348 354 360 366 372 378 384)
	set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/gefsstatus.txt`
	set count = 0
	while (($valid < $FHour) && ($count < 85))
		sleep 20
		@ count = $count + 1	
		set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/gefsstatus.txt`
	end	
	#process
	if ($FHour == 000) then
		echo `date` ": ${ModRunTime}Z GEFS Starting" >> /home/apache/climate/data/forecast/text/gefstimes.txt
		#python /home/scripts/stats/modtimes/nam4km.py
		csh $Runner $dateForDir $ModRunTime GEFS $FHour
		#perl /home/scripts/models/clearmodeldirpng.pl $ModRunTime NAM4KM
		
	else if ($FHour == 384) then
		csh $Runner $dateForDir $ModRunTime GEFS $FHour
		echo `date` ": ${ModRunTime}Z GEFS Finished" >> /home/apache/climate/data/forecast/text/gefstimes.txt
		#python /home/scripts/stats/modtimes/nam4km.py
	else
		csh $Runner $dateForDir $ModRunTime GEFS $FHour
	endif
	#perl /home/scripts/models/blister.pl $ModRunTime NAM4KM $FHour 87
	php /home/scripts/models/blister.php GEFS $dateForDir $FHour
end
wait
