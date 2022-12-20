import Link from 'next/link';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';

export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                
                <a href={'/'}> ig.doubts </a>
                <nav>
                    <a  className={styles.active}>Home</a>
                    <a>Doubts</a>
                </nav>
                <SignInButton/>
            </div>
        </header>
    )
}