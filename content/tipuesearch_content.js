var tipuesearch = {"pages": [{'title': 'About', 'text': '\n \n \n 此內容管理系統以\xa0 https://github.com/mdecourse/cmsimde \xa0作為 submodule 運作, 可以選定對應的版本運作, cmsimde 可以持續改版, 不會影響之前設為 submodule, 使用舊版 cmsimde 模組的內容管理相關運作.. \n 利用 cmsimde 建立靜態網誌方法: \n 1. 在 github 建立倉儲, git clone 到近端 \n 2. 參考\xa0 https://github.com/mdecourse/newcms , 加入除了 cmsimde 目錄外的所有內容 \n 以 git submodule add\xa0 https://github.com/mdecourse/cmsimde \xa0cmsimde \n 建立 cmsimde 目錄, 並從 github 取下子模組內容. \n 3.在近端維護時, 更換目錄到倉儲中的 cmsimde, 以 python wsgi.py 啟動近端網際伺服器. \n 動態內容編輯完成後, 以 generate_pages 轉為靜態內容, 以 git add commit 及 push 將內容推到遠端. \n 4. 之後若要以 git clone 取下包含 submodule 的所有內容, 執行: \n git clone --recurse-submodules  https://github.com/mdecourse/newcms.git \n', 'tags': '', 'url': 'About.html'}, {'title': 'W17翻譯', 'text': "原文: \n This tutorial will guide you step-by-step into building a clean simulation model, of a robot, or any other item. This is a very important topic, maybe the most important aspect, in order to have a nice looking, fast displaying, fast simulating and stable simulation model. \n To illustrate the model building process, we will be building following manipulator: \n \n [Model of robotic manipulator] \n \n \n \n \n Building the visible shapes \n \n \n \n When building a new model, first, we handle only the visual aspect of it: the dynamic aspect (its undelying even more simplified/optimized model), joints, sensors, etc. will be handled at a later stage. \n We could now directly create primitive shapes in CoppeliaSim with [Menu bar --> Add --> Primitive shape --> ...]. When doing this, we have the option to create \xa0 pure shapes, or regular shapes . Pure shape will be optimized for dynamic interaction, and also directly be dynamically enabled (i.e. fall, collide, but this can be disabled at a later stage). Primitive shapes will be simple meshes, which might not contain enough details or geometric accuracy for our application. Our other option in that case would be to import a mesh from an external application. \n When importing CAD data from an external application, the most important is to make sure that the CAD model is not too heavy, i.e. doesn't contain too many triangles. This requirement is important since a heavy model will be slow in display, and also slow down various calculation modules that might be used at a later stage (e.g. \xa0 minimum distance calculation , or \xa0 dynamics ). Following example is typically a no-go (even if, as we will see later, there are means to simplify the data within CoppeliaSim): \n \xa0 \n \n [Complex CAD data (in solid and wireframe)] \n \n Above CAD data is very heavy: it contains many triangles (more than 47'000), which would be ok if we would just use a single instance of it in an empty scene. But most of the time you will want to simulate several instances of a same robot, attach various types of grippers, and maybe have those robots interact with other robots, devices, or the environment. In that case, a simulation scene can quickly become too slow. Generally, we recommend to model a robot with no more than a total of 20'000 triangles, but most of the time 5'000-10'000 triangles would just do fine as well. Remember: less is better, in almost every aspect. \n What makes above model so heavy? First, models that contain holes and small details will require much more triangular faces for a correct representation. So, if possible, try to remove all the holes, screws, the inside of objects, etc. from your original model data. If you have the original model data represented as parametric surfaces/objects, then it is most of the time a simple matter of selecting the items and deleting them (e.g. in Solidworks). The second important step is to export the original data with a limited precision: most CAD applications let you specify the level of details of exported meshes. It might also be important to export the objects in several steps, when the drawing consists of large and small objects; this is to avoid having large objects too precisely defined (too many triangles) and small objects too roughly defined (too few triangles): simply export large objects first (by adjusting the desired precision settings), then small objects (by adjusting up precision settings). \n CoppeliaSim supports currently following CAD data formats: \xa0 OBJ , \xa0 STL , \xa0 DXF , \xa0 3DS \xa0 (Windows only), and \xa0 Collada . \xa0 URDF \xa0 is also supported, but not mentionned here since it is not a pure mesh-based file format. \n Now suppose that we have applied all possible simplifications as described in previous section. We might still end-up with a too heavy mesh after import: \n \n [Imported CAD data] \n \n You can notice that the whole robot was imported as a single mesh. We will see later how to divide it appropriately. Notice also the wrong orientation of the imported mesh: best is to keep the orientation as it is, until the whole model was built, since, if at a later stage we want to import other items that are related to that same robot, they will automatically have the correct position/orientation relative to the original mesh. \n At this stage, we have several functions at our disposal, to simplify the mesh: \n \n \n Automatic mesh division: \xa0 allows to generate a new shape for all elements that are not linked together via a common edge. This does not always work for the selected mesh, but is always worth a try, since working on mesh elements gives us more control than if we had to work on all elements at the same time. The function can be accessed with [Menu bar --> Edit --> Grouping/Merging --> Divide selected shapes]. Sometimes, a mesh will be divided more than expected. In that case, simply merge elements that logically belong together (i.e. that will have the same visual attributes and that are part of the same link) back into one single shape ([Menu bar --> Edit -> Grouping/Merging --> Merge selected shapes]). \n Extract the convex hull: \xa0 allows to simplify the mesh by transforming it into a convex hull. The function can be accessed with [Menu bar --> Edit --> Morph selection into convex shapes]. \n Decimate the mesh: \xa0 allows to reduce the number of triangles contained in the mesh. The function can be accessed with [Menu bar --> Edit --> Decimate selected shape...]. \n Remove the inside of the mesh: \xa0 allows to simplify the mesh by removing its inside. This function is based on \xa0 vision sensors \xa0 and might give more or less satisfying results depending on the selected settings. The function can be accessed with [Menu bar --> Edit --> Extract inside of selected shape]. \n \n \n There is no predefined order in which above functions can/should be applied (except for the first item in the list, which should always be tried first), it heavily depends on the geometry of the mesh we are trying to simplify. Following image illustrates above functions applied to the imported mesh (let's suppose the first item in the list didn't work for us): \n \n [Convex hull, decimated mesh, and extracted inside] \n \n Notice how the convex hull doesn't help us at this stage. We decide to use the mesh decimation function first, and run the function twice in order to divide the number of triangles by a total of 50. Once that is done, we extract the inside of the simplified shape and discard it. We end-up with a mesh containing a total of 2'660 triangles (the original imported mesh contained more than 136'000 triangles!). The number of triangles/vertices a shape contains can be seen in the \xa0 shape geometry dialog . 2'660 triangles are extremely few triangles for a whole robot model, and the visual appearance might suffer a little bit from it. \n At this stage we can start to divide the robot into separate links (remember, we currently have only a single shape for the whole robot). You can do this in two different ways: \n \n \n Automatic mesh division: \xa0 this function, which was already described in previous section, will inspect the shape and generate a new shape for all elements that are not linked together via a common edge. This does not always work, but is always worth a try. The function can be accessed with [Menu bar --> Edit --> Grouping/merging --> Divide selected shapes]. \n Manual mesh division: \xa0 via the the \xa0 triangle edit mode , you can manually select the triangles than logically belong together, then click \xa0 Extract shape . This will generate a new shape in the scene. Delete the selected triangles after that operation. \n \n \n In the case of our mesh, method 1 worked fine: \n \n [Divided mesh] \n \n Now, we could further refine/simplify individual shapes. Sometimes also, a shape might look better if its convex hull is used instead. Othertimes, you will have to use several of above's described techniques iteratively, in order to obtain the desired result. Take for instance following mesh: \n \n [Imported mesh] \n \n The problem with above's shape is that we cannot simplify it nicely, because of the holes it contains. So we have to go the more complicated way via the \xa0 shape edit mode , where we can extract individual elements that logically belong to the same convex sub-entity. This process can take several iterations: we first extract 3 approximate convex elements. For now, we ignore the triangles that are part of the two holes. While editing a shape in the shape edit mode, it can be convenient to switch the \xa0 visibility layers , in order to see what is covered by other scene items. \n \n [Step 1] \n \n We end up with a toal of three shapes, but two of them will need further improvement. Now we can erase the triangles that are part of the holes. Finally, we extract the convex hull individually for the 3 shapes, then merge them back together with [Menu bar --> Edit --> Grouping/Merging --> merge selected shapes]: \n \n \n [Step 2] \n \n In CoppeliaSim, we can enable/disable edge display for each shape. We can also specify an angle that will be taken into account for the edge display. A similar parameter is the \xa0 shading angle , that dictates how facetted the shape will display. Those parameters, and a few others such as the shape \xa0 color , can be adjusted in the \xa0 shape properties . Remember that \xa0 shapes come in various flavours . In this tutorial we have only dealt with simple shapes up to now: a simple shape has a single set of visual attributes (i.e. one color, one shading angle, etc.). If you merge two shapes, then the result will be a simple shape. You can also group shapes, in which case, each shape will retain its visual attributes. \n In next step, we can merge elements that logically belong together (if they are part of the same rigid element, and if they have the same visual attributes). Then we change the visual attributes of the various elements. The easiest ist to adjust a few shapes that have different colors and visual attributes, and if we name the color with a specific string, we can later easily programmatically change that color, also if the shape is part of a compound shape. Then, we select all the shapes that have the same visual attributes, then control-select the shape that was already adjusted, then click \xa0 Apply to selection , once for the \xa0 Colors , once for the \xa0 other properties , in the \xa0 shape properties : this transfers all visual attributes to the selected shapes (including the color name if you provided one). We end up with 17 individual shapes: \n \n [Adjusted visual attributes] \n \n Now we can group the shapes that are part of the same link with [Menu bar --> Edit --> Grouping/merging -> Group selected shapes]. We end up with 7 shapes: the base of the robot (or base of the robot's hierarchy tree), and 6 mobile links. It is also important to correctly name your objects: you we do this with a double-click on the object name in the \xa0 scene hierarchy . The base should always be the robot or model name, and the other objects should always contain the base object name, like: \xa0 robot \xa0 (base), \xa0 robot_link1 , \xa0 robot_proximitySensor , etc. By defaut, shapes will be assigned to visibility layer 1, but can be changed in the \xa0 object common properties . By default, only \xa0 visibility layers 1-8 are activated for the scene . We now have following (the model \xa0 ResizableFloor_5_25 \xa0 was temporarily made invisible in the \xa0 model properties dialog ): \n \n [Individual elements compositn the robot] \n \n When a shape is created or modified, CoppeliaSim will automatically set its reference frame position and orientation. A shape's reference frame will always be positioned at the shape's geometric center. The frame orientation will be selected so that the shape's bounding box remains as small as possible. This does not always look nice, but we can always reorient a shape's reference frame at any time. We now reorient the reference frames of all our created shapes with [Menu bar --> Edit --> Reorient bounding box --> with reference frame of world]. You have more options to reorient a reference frame in the \xa0 shape geometry dialog . \n \n 中文: \n 建立一個簡潔的模型教學 \n 這個教學會一步一步的引導你去建造出一個簡潔可模擬模型、機器人，或任何其他項目。這是一個非常重要的主題，或許是最重要的方面‧為了有良好的外觀、迅速的展示、模擬，然後穩定的模擬模型。 \n \xa0 \n 為了說明建造模型的過程，我們會建立一個機械手臂 : \n \n 建立可見的形狀 \n \xa0 \n 當建立新的模型時，首先，我們先處理模組大小規格 : 動態方面 ( 讓模型簡化 / 優化 ) ，支點，感應器 ….. 等等，之後會將處理。 \n \xa0 \n 我們可以直接在 CoppeliaSim 建立原始形狀 [Menu bar --> Add --> Primitive shape --> ...] 當這樣做時，我們可以選擇創建純粹的形狀或是有規格的形狀，純粹的形狀將會對動態的互動進行優化，爾且可以直接啟用動態 ( 例如 : 跌落、破狀，這些也可以在之後關掉 ) ，基本的形狀就是簡單得網格，對於我們的運用可能沒有足夠的細節或是幾何精度。在這種情況下，我們的可以選擇從外部應用程式導入網格，從外部應用程式匯入 CAD 資料時，最重要的是要確保 CAD 的模型不會有太多複雜的面，例如 : 不要包含太多的三角形。此要求很重要，因為有太多複雜面的模型在顯示時會非常緩慢，還會減慢了之後可能使用的各種計算模塊 ( 例如 : 最小距離計算或是動態計算 ) ， 以下示例通常是不行的 ( 即使是下方的例子也有方法可以簡化 CoppeliaSim 中的數據 ) \n \n 關於 CAD 資料太大 : 這包含太多三角形 ( 超過 47000 個 ) ， 如果我們只在空場景中使用一個實例，那沒關係，但是大多數時候，你會想要模擬同一個機器人的多個實例、附加各種類型的爪子、或許也會讓那些機器人與其他機器人互動、還有其他設備或環境。在下面的例子，模擬場景可能快速變得緩慢，通常，我們建議對不超過 2 萬個三角形的機器人進行建模。大多數時用 5000~10000 個三角形比較好，記住 : 幾乎所有方面都是越少越好。 \n \xa0 \n \xa0 \n 是什麼讓上述模型太大 ? 首先，有包含孔和小細節的模型將需要更多的三角形面才能正確顯示 \n ，所以可能的話，嘗試從原始模型中刪除所有孔，螺釘，物體內部物件等。如果原始模型顯示有參數化的曲面 / 物件，那麼在大多數情況下，選擇項目並刪除它們就很簡單了 ( 例如 : 在 Solidworks 中 ) 。第二個重要步驟是在有限的精度中導出原始資料 : 大多數 CAD 應用程序可讓您指定導出網格的詳細程度，當圖形包含大小物件時，分步導出物件也是很重要的 ; 這是為了避免大物件定義太精確 ( 太多三角形 ) 而小物件定義太粗糙 ( 太少三角形 ) ，先導出大型的物件 ( 通過所需的調整精度設置 ) 然後是小物件 ( 在調整精度設置 ) 。 \n \xa0 \n \xa0 \n CoppeliaSim 支援當前以下 CAD 數據格式 :OBJ 、 STL 、 DXF 、 3DS( 限定 Windows) 、 Collada 。還有 URDF 也是支援的，但是這裡沒有提到，因為它不是基於網格的純文件格式。 \n \xa0 \n \xa0 \n 現在假設我們已經按照上一節中的描述使用了所有可能的簡化，我們可能最終在導入後仍然會留下太多的網格 : \n \xa0 \n 你可能注意到整個機器人是作為單個網格導入的，之後我們將看到如何對它進行適當分開，還要注意導入的網格是否方向錯 : 建立完整模型之前，最好是保持原樣，因為，如果以後要導入與同一機器人相關的其他項目，它們將自動保有相對於原始網格的正確位置 / 方向。 \n \xa0 \n 在此階段，我們可以使用多種功能來簡化網格： \n \xa0 \n ‧ Automatic mesh division : 允許為所有元素生成新形狀，當他們沒有通過共同的邊緣鏈接在一起時，這個不是一直有用於選定的網格，但是值得一試，因為與必須同時處理所有元素相比，處理網格元素可以為我們提供更多的控制權。該功能可以通過 [Menu bar --> Edit --> Grouping/Merging --> Divide selected shapes] 。有時候，網格的劃分將超出預期。在這種情況下，只需合併邏輯上屬於一起的元素 ( 例如 : 具有相同的視覺屬性，並且是同一鏈接的一部分 ) 回到一個單一的形狀 ([Menu bar --> Edit -> Grouping/Merging --> Merge selected shapes]) \n ‧ Extract the convex hull: 通過將其轉換為凸包來簡化網格，該功能可以通過 [Menu bar --> Edit --> Morph selection into convex shapes]. \n ‧ Decimate the mesh: 允許減少網格中包含的三角形數量，該功能可以通過 [Menu bar --> Edit --> Decimate selected shape...] \n ‧ Remove the inside of the mesh: 允許通過刪除其內部來簡化網格。此功能基於視覺傳感器，並且可能會根據所選設置提供或多或少令人滿意的結果，該功能可以通過 [Menu bar --> Edit --> Extract inside of selected shape] \n \xa0 \n 上述的功能沒有定義應該使用的順序 ( 除列表中的第一項外，應始終先嘗試 ) ，在很大程度上取決於我們要簡化網格的幾何形狀，下圖說明了上述功能導入網格的應用 ( 假設列表中的第一項對我們不起作用 ): \n \xa0 \n 請注意，凸包在現階段如何對我們沒有幫助。我們先決定使用網格的抽取功能，並將此功能運行兩次以至三角形的總數到 50 \n ，一旦完成，我們提取簡化形狀的內部並將其丟棄，我們最終得到一個總共 2'660 個三角形的網格 ( 原始導入的網格超過 136'000 個三角形 ) 。 整個模型包含的三角形 / 頂點的數量可以在形狀幾何對話框中看到， 2'660 個三角形對於整個機器人模型來說是很少的三角形，但是視覺外觀可能會因此受到一點影響。 \n \xa0 \n 在這一階段，我們可以開始將機器人劃分為單獨的鏈接 ( 請記住，我們目前整個機器人只有一個形狀 ) ，你可以通過兩種不同的方式執行此操作： \n ‧ Automatic mesh division: 這個功能，上一節已經描述過了，將檢查形狀並為未通過公共邊鏈接在一起的所有元素生成新形狀，這並不總是有效， 但是值得一試，該功能可以通過 [Menu bar --> Edit --> Grouping/Merging --> Divide selected shapes] 。 \n ‧ Manual mesh division: 通過三角形編輯模式，您可以手動選擇邏輯上屬於三角形的三角形，點擊 Extract shape 。這將在場景中產生新的形狀，完成該操作後，刪除選定的三角形。 \n \xa0 \n 在這個例子中我們的網格，方法 1 效果很好 : \n \n 現在，我們可以進一步細化 / 簡化單個形狀，有時也可以使用凸包代替形狀，有時，您將不得不反複使用上述幾種技術，以獲得所需的結果。 以以下網格為例： \n \n \xa0 \n 上面形狀的問題是我們不能很好地簡化它，因為它包含孔。因此，我們必須通過形狀編輯模式採用更複雜的方法，在這裡我們可以提取在邏輯上屬於同一個凸子實體的單個元素。此過程可能需要多次重覆：首先我們提取 3 個近似凸元素。現在，我們忽略為兩個孔的一部分的三角形。在形狀編輯模式下編輯形狀時，切換可見性層會很方便，還有方便查看其他場景項目所涵蓋的內容。 \n \xa0 \n \xa0 \n 我們最終得到三種形狀，但是其中兩個將需要進一步改進。現在我們可以刪除作為孔的一部分的三角形。最後，我們分別提取 3 種形狀的凸包，然後將它們合併在一起 [Menu bar --> Edit --> Grouping/Merging --> merge selected shapes]: \n \xa0 \n \xa0 \n 在 CoppeliaSim 中，我們可以啟用 / 禁用每種形狀的邊緣顯示。我們還可以指定邊緣顯示時要考慮的角度。相似的參數是陰影角，決定形狀如何顯示。那些參數，還有其他一些，例如形狀顏色 \n ，可以調整形狀屬性。請記住形狀各異。在本教程中，到目前為止，我們僅處理了簡單的形狀 : 一個簡單的形狀具有一組視覺屬性 ( 例如一種顏色，一種陰影角度等 ) 。如果合併兩個形狀，那麼結果將是一個簡單的形狀。您還可以對形狀進行分組，在這種情況下，每個形狀將保留其視覺屬性。 \n \xa0 \n 在下一步中，我們可以合併在邏輯上屬於一樣的元素 ( 如果它們是同一剛性元素的一部分，並且它們具有相同的視覺屬性 ) 。然後我們更改各種元素的視覺屬性。最簡單的方法是調整一些具有不同顏色和視覺屬性的形狀，如果我們用特定的字符串命名顏色，我們以後可以輕鬆地以編程方式更改該顏色，如果形狀是複合形狀的一部分，也是如此。然後，我們選擇具有相同視覺屬性的所有形狀，然後控制選擇已調整的形狀，然後單擊 Apply to selection ，一次用於顏色，一次用於其他屬性，在形狀屬性中：這會將所有視覺屬性轉移到所選形狀 ( 包括顏色名稱，如果提供的話 ) 。 我們最終得到 17 個單獨的形狀：  \n \xa0 \n \xa0 \n 現在我們可以將屬於同一鏈接的形狀分組 [Menu bar --> Edit --> Grouping/merging -> Group selected shapes]   我們最終得到 7 種形狀機器人的基底 ( 或機器人層次結構樹的基礎 ) ，和 6 個移動鏈接。正確命名物件也很重要 : 您可以通過雙擊場景層次中的對象名稱來執行此操作。基礎應該始終是機器人或型號名稱，其他對象應始終包含基礎對象名稱，例如： robot(base) ， robot_link1 ， robot_proximitySensor 等。默認情況下，形狀將分配給可見性圖層 1 ，但是可以更改對象的通用屬性。默認情況下，僅激活場景的可見性層 1-8 。我們現在有以下 ( 模型 ResizableFloor_5_25 在模型屬性對話框中暫時不可見 ): \n \xa0 \n \xa0 \n 創建或修改形狀時， CoppeliaSim 將自動設置其參考框架的位置和方向，形狀的參考框架將始終位於形狀的幾何中心。將選擇框架方向，以便形狀的邊界框保持盡可能小。這並不是一直看起來不錯，但是我們總是可以隨時調整形狀的參考框架的方向。現在，我們使用以下命令重新調整所有已創建形狀的參考框架的方向： [Menu bar --> Edit --> Reorient bounding box --> with reference frame of world] 。您有更多選項可以在形狀幾何對話框中重新定向參考框架。 \n", 'tags': '', 'url': 'W17翻譯.html'}, {'title': 'W15', 'text': '學習成果 \n \n', 'tags': '', 'url': 'W15.html'}, {'title': 'Develop', 'text': 'https://github.com/mdecourse/cmsimde \xa0的開發, 可以在一個目錄中放入 cmsimde, 然後將 up_dir 中的內容放到與 cmsimde 目錄同位階的地方, 使用 command 進入 cmsimde 目錄, 執行 python wsgi.py, 就可以啟動, 以瀏覽器 https://localhost:9443\xa0就可以連接, 以 admin 作為管理者密碼, 就可以登入維護內容. \n cmsimde 的開發採用 Leo Editor, 開啟 cmsimde 目錄中的 cmsimde.leo 就可以進行程式修改, 結束後, 若要保留網際內容, 只要將 cmsimde 外部的內容倒回 up_dir 目錄中即可後續對 cmsimde 遠端倉儲進行改版. \n init.py 位於\xa0 up_dir 目錄, 可以設定 site_title 與 uwsgi 等變數. \n', 'tags': '', 'url': 'Develop.html'}, {'title': 'Solvespace', 'text': '', 'tags': '', 'url': 'Solvespace.html'}, {'title': 'w7', 'text': '在About內容加入"This is compiled by 407xxxxx" \n \n \n \n', 'tags': '', 'url': 'w7.html'}, {'title': '編譯', 'text': '先將 Y:\\portablegit\\bin\\sh.exe 改名為 sh_rename_for_solvespace.exe \n git clone --recurse-submodules https://github.com/solvespace/solvespace.git solvespace \n (將子模組中的資料全部取下放在solvespace的資料夾中) \n 上述步驟同: \n \xa0 \xa0 \xa0git clone\xa0 https://github.com/solvespace/solvespace.git \xa0 \n \xa0 \xa0 \xa0cd solvespace \n \xa0 \xa0 \xa0git submodule init \n \xa0 \xa0 \xa0git submodule update \n edit Y:\\tmp\\solvespace\\extlib\\angle\\CMakeLists.txt comment out line 713 and 714 \n (原本會尋找713和714行但因為無法編譯所以將其註解掉) \n (在windows中的動態資料庫裡就有了，若有需要再給它即可) \n 接著需要手動進行 libpng.dll.a 的編譯, 並改名為 libpng_static.a, 並放到編譯系統的 lib 目錄中 (即隨身系統的 msys64\\mingw64\\lib 目錄) \n cd solvespace \n cd extlib \n cd libpng \n mkdir build \n cd build \n cmake .. -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release mingw32-make \n 將libpng.dll.a重新命名為libpng_static.a並且複製到\xa0 Y:\\msys64\\mingw64\\lib \n 完成後若solvespace.exe可順利打開即成功 \n', 'tags': '', 'url': '編譯.html'}, {'title': '繪圖示範', 'text': '\n', 'tags': '', 'url': '繪圖示範.html'}, {'title': 'V-rep', 'text': '', 'tags': '', 'url': 'V-rep.html'}, {'title': '雙輪車控制模擬', 'text': '', 'tags': '', 'url': '雙輪車控制模擬.html'}]};