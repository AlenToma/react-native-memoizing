# react-native-memoizing
`react-native-memoizing` support all `react-native-sqlite-2` support, eg React Native for Android, iOS, Windows and macOS

The idea of this library is to make sure your data gets memorized and reused, instead of making a long calls to your server each times. This Help speed up the data retrivnings operations. The cash mekanism is totally configrurable, so you could specify how long the data should be cashed untill it refreshed.

This library is not on npmjs yet as its not finished yet, So use it on your own risk.
## Installations 
`npm install https://github.com/AlenToma/react-native-memoizing.git react-native-sqlite-2`

## MemorizeOptions
| Property  | Type  | Optional | Description |
| --------- | ------| ------------ | ------------|             
| isDebug  | boolean  | YES  | Setting this to true will make sure not to save the data to the db.|
| storage  | IStorage | YES | The library uses its own storage, but you could implement IStorage and use your own.|
| daysToSave  | number  | NO  | This will tell the storage how many days too keep the data before refreshing it. |
| keyModifier  | Function<string>  | YES  | the library creates a key from the (args and methodname) to method, you could also modify it using this.|
| validator  | Function<boolean>  | YES  | Validate and tell the library to save it or not |
| encryptionKey  | string  | YES  | encryption key if you would like to secure the data |

## Memorize Attribute Example
 ```ts
 import {Memorize} from 'react-native-memoizing'
 class Repository {
  
  @Memorize({
  daysToSave:2,
  validator:(data: any[])=> data.length>0
  })
  async fetchData(dataName?: string, id?:number){
     let data = [1,2,5,2,3,6,4, "test", "asdjkhasd"];
     if (dataName)
         data = data.filter(x=> x== dataName);
     if (id)
         data = data.filter(x=> x== id);
     return data;
  }
 }
 
 const rep = Repository();
 // see this example fetchData will only be called once, data2 will trigger fetchData as it has diffrient parameters.
 const data1= rep.fetchData();
 const data1= rep.fetchData();
 
 const data2= await rep.fetchData("test");
 ```
 
 ## useMomorize
 This is a hooks that also work like Memorize
 ```ts 
 const app =()=> {
 // now if the key userName exist it will be retrived else you have to setItems
 // setting it to undefined will remove the data from the db
 // you could also assign MemorizeOptions here to. 
 const [items, setItems]= useMomorize("userName", undefined as string | undefined);
 
 }
 ```
 
 This library is not finished, There is much more we could implement.
 
 ## Contribute
 If you would like to help improve the library, then you are very wellcome to create issue, implement new functionality etc.
 
