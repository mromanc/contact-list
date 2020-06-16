public with sharing class ContactController {
    public static List<Contact> getContactsWithAccountName(){
        List<Contact> listName = [SELECT Name, Email, Account.Name FROM Contact];
        return listName;
    } 
}
