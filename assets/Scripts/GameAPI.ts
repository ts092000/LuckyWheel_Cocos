import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameAPI')
export class GameAPI extends Component {
    public async fetchAPI(apiUrl: string, requestOptions: any): Promise<void> {
        fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            })
            .then(data => {
                console.log('data: ', data);
            })
            .catch(error => {
                console.log('e:' , error);
            })        
    }
}


