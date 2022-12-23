import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';

export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                
                <a href='/'> ig.doubts </a>
                <nav>
                    <ActiveLink activeClassName={styles.active} href='/'>               
                        <a> 
                            Home
                        </a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href='/doubts'>
                        <a>
                            Doubts
                        </a>
                    </ActiveLink>
                    
                </nav>
                <SignInButton/>
            </div>
        </header>
    )
}