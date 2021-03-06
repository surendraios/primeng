import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { VersionService } from './service/versionservice';
import { AppConfigService } from './service/appconfigservice';
import { AppConfig } from './domain/appconfig';
import { Subscription } from 'rxjs';

declare let gtag: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    menuActive: boolean;

    newsActive: boolean = false;

    versions: any[];

    config: AppConfig;

    public subscription: Subscription;

    constructor(private router: Router, private versionService: VersionService, private configService: AppConfigService) {}

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => this.config = config);

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                gtag('config', 'UA-93461466-1',
                      {
                        'page_path': '/primeng' + event.urlAfterRedirects
                      }
                );

                this.hideMenu();
             }
        });

        this.newsActive = this.newsActive && sessionStorage.getItem('primenews-hidden') == null;
        this.versionService.getVersions().then(data => this.versions = data);
    }

    onMenuButtonClick() {
        this.menuActive = true;
        this.addClass(document.body, 'blocked-scroll');
    }

    onMaskClick() {
        this.hideMenu();
    }

    hideMenu() {
        this.menuActive = false;
        this.removeClass(document.body, 'blocked-scroll');
    }

    addClass(element: any, className: string) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element: any, className: string) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    hideNews(event) {
        this.newsActive = false;
        sessionStorage.setItem('primenews-hidden', 'true');
        event.preventDefault();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
