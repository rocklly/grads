*Purpose: College of DuPage Models Product Shell
*Author: Gensini, Winter 2015
*************************************************************************
*always run this function to get model arguments and plotting defaults
function main(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 runtime=subwrd(args,5)
 'run /home/scripts/grads/functions/pltdefaults.gs'
*GLOBAL VARIABLES
filext = '.png'
txtext = '.txt'
basedir = '/home/apache/servername/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
if modname = NAMAK
 modname = NAM
endif
if modname = GFS | modname = NAM | modname = GEM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
if modname = CFS
 'set t 'fhour/6+1
endif
if modname = ECMWF
 'set t 'fhour/24+1
endif
*get some time parameters
*'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 MET 300 EXAM 3 Map (300 hPa)'
*give the product a name between sector and fhour variables and combo into filename variables
*prodname = modname sector _500_spd_ fhour
*filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
*pick a colorbar
*'run /home/scripts/grads/colorbars/color.gs 30 170 5 -kind white-(0)->darkgreen-(2)->lime-(0)->olive-(2)->yellow-(0)->maroon-(4)->red-(0)->darkmagenta-(4)->magenta-(0)->mediumblue-(4)->cyan-(0)->gray-(4)->white'
*set level (set both!)
level = 300
'set lev 'level
*'run /home/scripts/grads/functions/isotachs.gs 'modname' 'level
'run /home/scripts/grads/functions/interstates.gs 'sector
'run /home/scripts/grads/functions/states.gs 'sector
'set cint 60'
'run /home/scripts/grads/functions/isoheights.gs 'level' 'modname
'set gxout barb'
'set rgb 99 0 0 0'
'set ccolor 99'
'set cthick 1'
'set digsize 0.05'
'set barbopts filled'
'define xskip = skip(UGRDprs,6,6)*2'
'define yskip = skip(VGRDprs,6,6)*2'
'd xskip;yskip'
*start_readout
*if modname = GFS | modname = NAM | modname = RAP
* 'set gxout print'
* 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
* 'd windspeed'
* dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
*endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
*'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
*'printim map.png x1024 y768'
'gxprint map.pdf'