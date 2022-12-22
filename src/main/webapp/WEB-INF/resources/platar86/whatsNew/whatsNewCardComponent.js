/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by Nathan Brill, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

class Card {

    constructor(heading, imageUrl, updateRelese, list, pageUrl) {
        this.heading = heading;
        this.imageUrl = imageUrl;
        this.updateRelese = updateRelese;
        this.list = list;
        this.pageUrl = pageUrl;

    }

//    get something() {
//        return this.heading;
//    }
//    
//    set something(iets){
//        this.heading = iets;
//        this.headerH1.innerText = this.heading;
//    }



// #### Use the HTML helper to build this. 
    init() {
        let newCard = document.createElement("div");
        newCard.classList.add('blog-card');
        let target = document.getElementById("wrapper");
        target.appendChild(newCard);
        let wrapper = document.createElement('div');
        wrapper.classList.add("meta");
        newCard.appendChild(wrapper);
        let cardImage = document.createElement("div");
        cardImage.classList.add("photo");
        wrapper.appendChild(cardImage);
        cardImage.style = "background-image: url(" + this.imageUrl + ")";
        let ul = document.createElement("ul");
        ul.classList.add("details");
        wrapper.appendChild(ul);
        let list = document.createElement("li");
        list.classList.add("author");
        list.innerText = "SolarMD";
        ul.appendChild(list);
        let currentDate = document.createElement("li");
        let linkToPage = document.createElement("a");
        let getDate = function () {
            let d = new Date();
            return d.toLocaleDateString("en-US");
        };
        linkToPage.classList.add("date");
        currentDate.classList.add("date");
        currentDate.innerText = getDate();
        linkToPage.innerText = "link to page";
        linkToPage.href = this.pageUrl;
        ul.appendChild(currentDate);
        ul.appendChild(linkToPage);
        let descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add("description");
        newCard.appendChild(descriptionDiv);
        let headerH1 = document.createElement("h1");
        headerH1.innerText = this.heading;
        this.headerH1 = headerH1;
        descriptionDiv.appendChild(headerH1);
        let headerH2 = document.createElement("h2");
        descriptionDiv.appendChild(headerH2);
        headerH2.innerText = this.updateRelese + getDate();
        let descriptList = document.createElement("ul");
        descriptionDiv.appendChild(descriptList);
        let dList = document.createElement("li");
        descriptList.appendChild(dList);
        dList.innerText = this.list;
        let readMoreBtn = document.createElement("p");
        readMoreBtn.classList.add("read-more");
        descriptionDiv.appendChild(readMoreBtn);
        let readMoreLink = document.createElement("a");
        readMoreLink.innerText = "Read More";
        readMoreLink.href = "#";
        readMoreBtn.appendChild(readMoreLink);


    }
}



