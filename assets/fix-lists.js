// Fix list styles if CSS is not working
document.addEventListener('DOMContentLoaded', function() {
    // Select all ul and ol elements
    const lists = document.querySelectorAll('ul, ol');
    
    lists.forEach(function(list) {
        if (list.tagName === 'UL') {
            list.style.listStyleType = 'disc';
        } else if (list.tagName === 'OL') {
            list.style.listStyleType = 'decimal';
        }
        list.style.listStylePosition = 'outside';
        list.style.paddingLeft = '2rem';
        list.style.marginLeft = '2rem';
    });
    
    // Fix all li elements
    const listItems = document.querySelectorAll('li');
    listItems.forEach(function(item) {
        item.style.display = 'list-item';
    });
});
