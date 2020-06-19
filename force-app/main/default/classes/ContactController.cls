public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsWithAccountName(){
        List<Contact> listName = [SELECT Name, Email, Account.Name FROM Contact];
        return listName;
    } 
}
