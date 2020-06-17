import { Component, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeStringTime' })
export class RemoveStringTime implements PipeTransform {

  transform(str: string): any {

    return str.split(' ')[0].split('/')[1] + '/' + str.split(' ')[0].split('/')[0] + '/' + str.split(' ')[0].split('/')[2];

  }
}