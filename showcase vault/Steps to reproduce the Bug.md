## Bug: Multiple render childs are loaded in live preview mode

### Simple reproduction steps
1. open the dev console
2. make sure the `Default view for new tabs` setting is set to `Editing view` 
3. make sure the `Default editing mode`  setting is set to `Live Preview`
4. open each of file 1, file 2, file 3, file 4 (in sequence, all in the same tab)
5. repeat step 3
6. notice how the number of open markdown render children grows, even though we only have one file open at a time
7. close the tab
8. notice how all of the markdown render children finally get unloaded

### Our observerd console output after the reproduction steps
![[Console output of the bug affecting live preview.png]]

### Observed Behavior
In live preview, markdown render children only get closed, when the tab is closed. 

### Expected Behavior
As each new file is opend in the same tab, any markdown render children in the file just closed should be unloaded imediatly. So that only the render childs of the newly opened file are loaded.

## Bug: Multiple render childs are loaded in reading mode
After setting the default view for new tabs, the following steps are identical to above, but the console output differes.

### Simple reproduction steps
1. open the dev console
2. make sure the `Default view for new tabs` setting is set to `Reading view`
3. open each of file 1, file 2, file 3, file 4 (in sequence, all in the same tab)
4. repeat step 3
5. notice how the number of open markdown render children grows, even though we only have one file open at a time
6. close the tab
7. notice how all of the markdown render children finally get unloaded

### Our observerd console output after the reproduction steps
![[Console output of the bug affecting reading mode.png]]

### Observed Behavior
In reading mode, multiple markdown render children are created per code block. Some render children get unloaded immediatly and others only when the tab is closed.

### Expected Behavior
As each new file is opend in the same tab, any markdown render children in the file just closed should be unloaded imediatly. So that only the render childs of the newly opened file are loaded.