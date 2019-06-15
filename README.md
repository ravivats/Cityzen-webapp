# Cityzen-webapp

## Cityzen--Intelligent Complaint Addressal System

The proposed complaint addressal system has two different sides/panels. One side is for the citizens who use the application to make the authorities know about their grievances by lodging complaints. The other side is for the concerned authorities to take a look at public grievances and take necessary actions to adress them.

For doing this, they can simply sign-up for the platform using Facebook login, and then give a short description about themselves including their name, address, city, state, pincode & contact number. Upon completion of sign-up, they can easily register complaints about various public sectors departments <b>i.e. Education, Healthcare, Water & Sanitation, Law & Order, Waste Management, Electricity, Road & Transport.</b> To create a complaint, they have to fill in details like subject and description of complaint, category of which the problem belongs to, the no. of days since when the problem is faced and the approximate no. of people affected by it. This completes the process of lodging a complaint. 

Apart from lodging a complaint, a person can see and approve complaints made by other people who share the same pincode as the person. This checks people having to file a new complaint when someone has already complained about it, they just need to approve that complaint which they find legitimate and its priority score would increase consequently.  

Once, the complaint is lodged, it is automatically sorted into <b>High, Medium or Low priority complaint</b> by a sorting algorithm that takes into account the category of problem, no. of days since which the problem is faced, approx. no. of people affected by the problem and no. of approvals given to that complaint by other fellow residents of that area. Concerned authorities can then function affectively, trying to address complaints which are in the high priority zone first. The second section of the webapp deals with the analysis and visualization of all the data that we get from all the complaints. 

One of the features called <b>Hot Areas</b> uses a concept of semantic interpretation in Artificial Intelligence to detect similarity in complaints and highlight particular areas which have a significant amount of similar complaints on the map. 

Another feature <b>Public Mood Analysis</b> uses the concept of sentimental analysis to gain an insight on the general mood of the people from the description of the complaints lodged by them. 

Furthermore, data analysis features like bar graphs depicting the no. of complaints per category and the average no. of hours taken to address any complaint per category gives us an insight into the effectiveness and performance of the concerned authorities for each category in solving the complaints which come in their notice. Another feature helps to compare no. of complaints lodged in two dif-ferent areas corresponding to different pincodes to know which area is affected more in terms of problems related to public domain.
