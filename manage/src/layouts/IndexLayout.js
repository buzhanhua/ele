import React , { Component } from 'react';
import styles from './IndexLayout.less';
class IndexLayout extends Component{
     render(){
          return(
               <div className={styles.wrap}>
                    {this.props.children}
               </div>
          )
     }   
}

export default IndexLayout;