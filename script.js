let tablinks=document.getElementsByClassName('tab-links');
let tabcontents=document.getElementsByClassName('tab-contents');

function showdetails(tabname){
    for(tablink of tablinks){
        tablink.classList.remove('active-links');
    }
    for(tabcontent of tabcontents){
        tabcontent.classList.remove('active-tab');
    }

    event.currentTarget.classList.add('active-links');
    document.getElementById(tabname).classList.add('active-tab')
}