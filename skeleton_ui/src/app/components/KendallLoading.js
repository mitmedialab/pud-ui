import { useState, useEffect } from 'react';
import styles from './KendallLoading.module.css'; 

const KendallLoading = ({loading}) => {
    return (
        <div>
        {loading && 
            <div className={styles.container}>
                <div className={styles.loading}></div>
            </div>
        }
        </div>
    );
};

export default KendallLoading;